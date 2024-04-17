import { useRef, useEffect, useState, useCallback } from 'react';

export type ITool = 'draw' | 'crop' | 'text' | 'emoji'

interface UseCanvasEditorProps {
    fileEditorRef: React.RefObject<HTMLDivElement>;
    imageSrc: string;
    isDrawingEnabled: boolean;
    setSelectedTool: React.Dispatch<React.SetStateAction<ITool | null>>;
}

interface UseCanvasEditorReturn {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    color: string;
    brushSize: number;
    hasRotated: boolean;
    texts: Text[];
    undoSteps: number;
    redoSteps: number;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    setBrushSize: React.Dispatch<React.SetStateAction<number>>;
    undo: () => void;
    redo: () => void;
    resetRotation: () => void;
    rotateLeft: () => void;
    rotateRight: () => void;
    addText: () => void;
    onBlurText: (index: number, e: React.FocusEvent<HTMLDivElement>) => void;
    onDoubleClickText: (index: number) => void;
}

interface Text {
    text: string;
    x: number;
    y: number;
    isEditing: boolean;
}

export const useCanvasEditor = ({ imageSrc, isDrawingEnabled, fileEditorRef, setSelectedTool }: UseCanvasEditorProps): UseCanvasEditorReturn => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [color, setColor] = useState<string>('#64dc2f');
    const [brushSize, setBrushSize] = useState<number>(5);
    const [history, setHistory] = useState<string[]>([]);
    const [step, setStep] = useState<number>(0);
    const [hasRotated, setHasRotated] = useState<boolean>(false)

    const [texts, setTexts] = useState<Text[]>([]);

    // History functions
    const saveState = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas && canvas.getContext) {
            const context = canvas.getContext('2d');
            if (context) {
                const dataUrl = canvas.toDataURL();
                setHistory((prevHistory) => {
                    const newHistory = prevHistory.slice(0, step);
                    newHistory.push(dataUrl);
                    return newHistory;
                });
                setStep((prevStep) => prevStep + 1);
            }
        }
    }, [step]);
    const undo = useCallback(() => {
        if (step > 1) {
            setStep((prevStep) => prevStep - 1);
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (canvas && context) {
                const img = new Image();
                img.onload = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = history[step - 2];
            }
        }
    }, [step, history]);
    const redo = useCallback(() => {
        if (step < history.length) {
            setStep((prevStep) => prevStep + 1);
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (canvas && context) {
                const img = new Image();
                img.onload = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = history[step];
            }
        }
    }, [step, history]);

    // Text functions
    const addText = useCallback(() => {
        console.log('addText text length:', texts.length)
        const newText: Text = {
            text: "",
            x: canvasRef.current ? (canvasRef.current.width / 2) + (texts.length + 1) : 0,
            y: canvasRef.current ? (canvasRef.current.height / 2) + (texts.length + 1) : 0,
            isEditing: true,
        }
        setTexts([...texts, newText]);
    }, [])
    const updateText = useCallback((index: number, newText: Partial<Text>) => {
        setTexts(texts => texts.map((text, i) => i === index ? { ...text, ...newText } : text));
    }, []);

    const finalizeText = useCallback((index: number, textContent: string) => {
        updateText(index, { text: textContent, isEditing: false });
    }, [updateText]);

    const onBlurText = useCallback((index: number, e: React.FocusEvent<HTMLDivElement>) => {
        finalizeText(index, e.currentTarget.textContent || '');
        setSelectedTool(null);
    }, [finalizeText]);

    const onDoubleClickText = useCallback((index: number) => {
        updateText(index, { isEditing: true });
    }, [updateText]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        // draw canvas

        // draw texts on canvas
        if (context) {
            texts.forEach(text => {
                if (!text.isEditing) {
                    context.font = "16px Arial";
                    context.fillStyle = "white";
                    context.fillText(text.text, text.x, text.y);
                }
            });
        }

    }, [texts]);

    const rotateCanvas = useCallback((angle = 90) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempContext?.drawImage(canvas, 0, 0);

        canvas.width = tempCanvas.height;
        canvas.height = tempCanvas.width;

        context.save();
        if (angle === -90) {
            context.translate(0, canvas.height);
            context.rotate(-Math.PI / 2);
        } else {
            context.translate(canvas.width, 0);
            context.rotate(Math.PI / 2);
        }

        context.drawImage(tempCanvas, 0, 0);
        context.restore();

        setHasRotated(true)
    }, []);
    const rotateLeft = useCallback(() => rotateCanvas(-90), [rotateCanvas]);
    const rotateRight = useCallback(() => rotateCanvas(90), [rotateCanvas]);
    const resetRotation = useCallback(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        if (history.length > 0) {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = history[history.length - 1]
        }

        setHasRotated(false)
    }, [history]);

    // Drawing functions
    const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
        if (!isDrawingEnabled) return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        console.log('color:', color, 'brushSize:', brushSize)
        if (context && canvas) {
            const pos = getMousePos(canvas, event as MouseEvent); // Update the type of the event parameter
            context.beginPath();
            context.moveTo(pos.x, pos.y);
            setIsDrawing(true);
        }
    }, [isDrawingEnabled, color, brushSize]);

    const draw = useCallback((event: MouseEvent | TouchEvent) => {
        if (!isDrawing || !isDrawingEnabled) return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context && canvas) {
            const pos = getMousePos(canvas, event as MouseEvent); // Update the type of the event parameter
            context.lineTo(pos.x, pos.y);
            context.stroke();
        }
    }, [isDrawing, isDrawingEnabled]);
    const stopDrawing = useCallback(() => {
        if (!isDrawingEnabled) return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.closePath();
            setIsDrawing(false);
        }
    }, [isDrawingEnabled]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context && canvas) {
            context.lineCap = 'round';
            context.strokeStyle = color;
            context.lineWidth = brushSize;

            // 
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);

            // touch events
            // canvas.addEventListener('touchstart', startDrawing);
            // canvas.addEventListener('touchmove', draw);
            // canvas.addEventListener('touchend', stopDrawing);
            // canvas.addEventListener('touchcancel', stopDrawing);

            return () => {
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', stopDrawing);
                canvas.removeEventListener('mouseout', stopDrawing);
            };
        }
    }, [startDrawing, draw, stopDrawing, color, brushSize]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && isDrawingEnabled) {
            // should also work on touch devices
            canvas.addEventListener('mouseup', saveState);
            return () => {
                canvas.removeEventListener('mouseup', saveState);
            };
        }
    }, [saveState, isDrawingEnabled]);

    const calculateDimensions = (aspectRatio: number, padding = 20): { width: number, height: number } => {
        const maxWidth = fileEditorRef.current ? fileEditorRef.current.clientWidth - padding * 2 : 0;
        const maxHeight = fileEditorRef.current ? fileEditorRef.current.clientHeight - padding * 2 : 0;

        let canvasWidth = maxWidth;
        let canvasHeight = canvasWidth / aspectRatio;

        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = canvasHeight * aspectRatio;
        }

        return { width: canvasWidth, height: canvasHeight };
    }

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (!context) return console.error('Canvas context not found');

            const img = new Image();
            img.src = imageSrc;
            const handleResize = () => {
                const aspectRatio = img.width / img.height;
                const { width, height } = calculateDimensions(aspectRatio, 90);

                canvas.width = width;
                canvas.height = height;

                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                if (history.length === 0) {
                    saveState() // Only save initial state if no history exists
                }
            }

            img.onload = handleResize;
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            }
        }
    }, [imageSrc, saveState, history.length, calculateDimensions]);

    const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent): { x: number, y: number } => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    };

    return {
        canvasRef,
        color,
        brushSize,
        hasRotated,
        texts,
        redoSteps: history.length - step,
        undoSteps: step - 1,
        setColor,
        setBrushSize,
        undo,
        redo,
        resetRotation,
        rotateLeft,
        rotateRight,
        addText,
        onBlurText,
        onDoubleClickText
    };
};

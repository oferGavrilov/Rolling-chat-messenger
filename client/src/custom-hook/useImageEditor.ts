import { useState, useEffect, useCallback } from 'react'

interface UseImageEditorProps {
    ref: React.RefObject<HTMLCanvasElement>;
    initialImage: string | null;
}

interface TextObject {
    id: number;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    isSelected: boolean;
}


const useImageEditor = ({ ref, initialImage }: UseImageEditorProps) => {
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [zoomLevel, setZoomLevel] = useState<number>(1)
    const [isMirrored, setIsMirrored] = useState<boolean>(false)
    const [isFlipped, setIsFlipped] = useState<boolean>(false)
    const [grayscale, setGrayscale] = useState<number>(0); // 0 to 100
    const [texts, setTexts] = useState<TextObject[]>([]);
    const [editableTextId, setEditableTextId] = useState<number | null>(null);


    // clean the styles when the initial image changes
    useEffect(() => {
        setTexts([]);
        setZoomLevel(1);
        setIsMirrored(false);
        setIsFlipped(false);
        setGrayscale(0);
        setEditableTextId(null);
    }, [initialImage]);

    const renderTexts = useCallback((ctx: CanvasRenderingContext2D) => {
        texts.forEach(text => {
            ctx.font = `${text.fontSize}px Arial`;
            ctx.fillText(text.text, text.x, text.y);
        });
    }, [texts]);

    const initializeCanvas = useCallback(() => {
        if (!ref.current || !initialImage) return console.error('Canvas or initial image not found')

        const ctx = ref.current.getContext('2d')
        if (!ctx) return console.error('Canvas context not found')

        const renderImage = new Image()
        renderImage.crossOrigin = 'anonymous'
        renderImage.src = initialImage

        renderImage.onload = () => {
            if (!ref.current) return

            const parentDiv = ref.current.closest('.flex-1');
            if (!parentDiv) return console.error('Parent div not found')
            const maxWidth = parentDiv?.clientWidth - 200
            const maxHeight = parentDiv?.clientHeight - 200

            let scaledWidth = renderImage.width * zoomLevel;
            let scaledHeight = renderImage.height * zoomLevel;

            if (scaledWidth > maxWidth) {
                const scaleFactor = maxWidth / scaledWidth;
                scaledWidth = maxWidth;
                scaledHeight *= scaleFactor;
            }

            if (scaledHeight > maxHeight) {
                const scaleFactor = maxHeight / scaledHeight;
                scaledHeight = maxHeight;
                scaledWidth *= scaleFactor;
            }

            ref.current.width = scaledWidth * zoomLevel
            ref.current.height = scaledHeight * zoomLevel

            ctx.clearRect(0, 0, scaledWidth, scaledHeight);
            ctx.save()

            ctx.translate(isMirrored ? scaledWidth : 0, isFlipped ? scaledHeight : 0); // Move context to mirror or flip
            ctx.scale(isMirrored ? -1 : 1, isFlipped ? -1 : 1); // Apply scale to mirror or flip

            ctx.filter = `grayscale(${grayscale}%)`;

            ctx.drawImage(renderImage, 0, 0, scaledWidth, scaledHeight);
            renderTexts(ctx);
            ctx.restore();  // Restore the original state
            ctx.filter = 'none';
        }

    }, [ref, zoomLevel, initialImage, isMirrored, isFlipped, grayscale, renderTexts, texts]);

    useEffect(() => {
        initializeCanvas()
    }, [initializeCanvas])

    // Double-click to edit the text
    const handleDoubleClick = useCallback((event: MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        const ctx = ref.current?.getContext('2d');

        console.log('Double click')
        if (!rect) return console.error('Canvas rect not found');
        if (!ctx) return console.error('Canvas context not found');
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickedText = texts.find(text => {
            ctx.font = `${text.fontSize}px Arial`;
            const textWidth = ctx.measureText(text.text).width;
            const textHeight = text.fontSize;
            return x > text.x && x < text.x + textWidth && y > text.y - textHeight && y < text.y;
        });

        if (clickedText) {
            setEditableTextId(clickedText.id);
        }
    }, [texts, ref]);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return console.error('Canvas not found');

        canvas.addEventListener('dblclick', handleDoubleClick);

        return () => {
            canvas.removeEventListener('dblclick', handleDoubleClick);
        };
    }, [handleDoubleClick, ref]);

    // Drawing functionality
    useEffect(() => {
        if (!ref.current) return;
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let startPosition = { x: 0, y: 0 };
        let drawing = false;

        const startDrawing = (event: MouseEvent) => {
            if (!isDrawing) return;
            drawing = true;
            startPosition = { x: event.offsetX, y: event.offsetY };
            ctx.beginPath();
            ctx.moveTo(startPosition.x, startPosition.y);
        };

        const draw = (event: MouseEvent) => {
            if (!drawing) return;
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        };

        const finishDrawing = () => {
            if (!drawing) return;
            drawing = false;
            ctx.closePath();
        };

        if (isDrawing) {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', finishDrawing);
            canvas.addEventListener('mouseout', finishDrawing);
        }

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', finishDrawing);
            canvas.removeEventListener('mouseout', finishDrawing);
        };
    }, [isDrawing, ref]);

    const zoomIn = () => setZoomLevel(prevZoom => Math.min(prevZoom * 1.1, 5)); // Adjust max zoom level as needed
    const zoomOut = () => setZoomLevel(prevZoom => Math.max(prevZoom * 0.9, 0.1)); // Adjust min zoom level as needed
    const toggleMirror = () => setIsMirrored(!isMirrored);
    const toggleFlip = () => setIsFlipped(!isFlipped); // Toggle the flip state
    const addText = useCallback(() => {
        if (!ref.current) return console.error('Canvas not found');
    
        const canvasWidth = ref.current.width;
        const canvasHeight = ref.current.height;
        const margin = 10; // Margin from the edge of the canvas
        const defaultX = 50;
        const defaultY = 50;
    
        // Calculate new position based on existing texts
        let newX = defaultX * (texts.length + 1) % (canvasWidth - margin);
        let newY = defaultY * (texts.length + 1) % (canvasHeight - margin);
    
        // Adjust if newX or newY goes off the canvas
        if (newX + defaultX > canvasWidth - margin) {
            newX = margin;
            newY += defaultY;
        }
        if (newY + defaultY > canvasHeight - margin) {
            newY = margin;
        }
    
        const newText = {
            id: Date.now(),
            text: 'Edit me',
            x: newX,
            y: newY,
            fontSize: 20,
            isSelected: false
        };
    
        setTexts(currentTexts => [...currentTexts, newText]);
    }, [texts.length, ref]);
    
    const updateText = useCallback((id, updatedText) => {
        setTexts(texts.map(text => text.id === id ? { ...text, text: updatedText } : text));
    }, [texts]);
    
    return {
        setIsDrawing,
        zoomIn,
        zoomOut,
        toggleMirror,
        toggleFlip,
        grayscale,
        setGrayscale,
        addText,
        updateText,
        editableTextId,
        setEditableTextId,
        resetZoom: () => setZoomLevel(1)
    }
}

export default useImageEditor

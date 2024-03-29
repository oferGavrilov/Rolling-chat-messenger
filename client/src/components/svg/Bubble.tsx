export function Bubble () {
      return (
            <svg id="sw-js-blob-svg" style={{ width: '35%', position: 'absolute', top: '0', left: '-120px', display: 'block' }}
                  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <defs>
                        <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                              <stop id="stop1" stopColor="rgba(41.847, 88.566, 194.736, 1)" offset="0%"></stop>
                              <stop id="stop2" stopColor="rgba(108.903, 193.266, 247.102, 0.74)" offset="100%"></stop>
                        </linearGradient>
                  </defs>
                  <path fill="url(#sw-gradient)" d="M22.1,-35.8C24.9,-28.4,20.9,-16.9,18.4,-9.5C15.9,-2.1,15,1.2,15.2,6.3C15.4,11.4,16.8,18.2,14.4,20.6C12.1,23,6,21.1,1.9,18.5C-2.3,15.9,-4.6,12.7,-11.4,11.8C-18.2,10.8,-29.6,12,-35.2,8.2C-40.8,4.4,-40.8,-4.4,-37.9,-12C-35,-19.6,-29.3,-26,-22.5,-32.1C-15.7,-38.1,-7.9,-43.8,0.9,-45.1C9.7,-46.3,19.3,-43.1,22.1,-35.8Z" width="100%" height="100%" transform="translate(50 50)" strokeWidth="0" stroke="url(#sw-gradient)"></path>
            </svg>
      )
}

export function WavesBlue ({ className }: { className?: string }) {
      return (
            <svg id="visual" className={className} viewBox="0 0 900 600" style={{ position: "absolute", zIndex: "-10" }} xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="M0 448L11.5 453.2C23 458.3 46 468.7 69 467.8C92 467 115 455 138.2 457C161.3 459 184.7 475 207.8 483C231 491 254 491 277 479.2C300 467.3 323 443.7 346 450.2C369 456.7 392 493.3 415.2 513C438.3 532.7 461.7 535.3 484.8 533C508 530.7 531 523.3 554 518.3C577 513.3 600 510.7 623 500C646 489.3 669 470.7 692.2 475.3C715.3 480 738.7 508 761.8 503.7C785 499.3 808 462.7 831 448.8C854 435 877 444 888.5 448.5L900 453L900 601L888.5 601C877 601 854 601 831 601C808 601 785 601 761.8 601C738.7 601 715.3 601 692.2 601C669 601 646 601 623 601C600 601 577 601 554 601C531 601 508 601 484.8 601C461.7 601 438.3 601 415.2 601C392 601 369 601 346 601C323 601 300 601 277 601C254 601 231 601 207.8 601C184.7 601 161.3 601 138.2 601C115 601 92 601 69 601C46 601 23 601 11.5 601L0 601Z" fill="#3a72ec" strokeLinecap="round" strokeLinejoin="miter"></path></svg>)
}

export function WavesWhite ({ className }: { className?: string }) {
      return (
            <svg id="visual" className={className} viewBox="0 0 900 600" style={{ position: "absolute"}} xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="M0 406L12.5 416C25 426 50 446 75 460.5C100 475 125 484 150 488.3C175 492.7 200 492.3 225 474.5C250 456.7 275 421.3 300 415.3C325 409.3 350 432.7 375 448.5C400 464.3 425 472.7 450 468.3C475 464 500 447 525 451.8C550 456.7 575 483.3 600 477.8C625 472.3 650 434.7 675 433C700 431.3 725 465.7 750 476.2C775 486.7 800 473.3 825 467C850 460.7 875 461.3 887.5 461.7L900 462L900 601L887.5 601C875 601 850 601 825 601C800 601 775 601 750 601C725 601 700 601 675 601C650 601 625 601 600 601C575 601 550 601 525 601C500 601 475 601 450 601C425 601 400 601 375 601C350 601 325 601 300 601C275 601 250 601 225 601C200 601 175 601 150 601C125 601 100 601 75 601C50 601 25 601 12.5 601L0 601Z" fill="#ffffff" strokeLinecap="round" strokeLinejoin="miter"></path></svg>
      )
}

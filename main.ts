let y1 = 0
let x1 = 0
let memSize1 = 0
let zoomSize1 = 1
const buf = Buffer.create(120)
const zLayer1 = 1
let blurSize1 = 1
let screenStatic = 0
let pixelArray = [0]
let repeat = 0
let variable = scene.createRenderable(zLayer1, (image1: Image, camera: scene.Camera) => {
    pixelArray = []
    for (let i = 0; i < 15; i++) {
        pixelArray.push(image.screenImage().getPixel(randint(0, 159), randint(0, 119)))
    }
    if (screenStatic > 0) {
        for (let x = 0; x < 120; ++x) {
            image1.getRows(x, buf)
            repeat = Math.ceil(screenStatic / 120 + randint(screenStatic, -100) / 100)
            for (let y = 0; y < repeat; ++y) {
                buf[randint(0,119)] = pixelArray[randint(0,14)]
            }
            image1.setRows(x, buf)
        }
    }    
    let screenClone = image1.clone()
    if (blurSize1 != 1) {
    let tempImg = image.create(Math.ceil(160 / blurSize1), Math.ceil(120 / blurSize1))
    helpers.imageBlit(tempImg, 0, 0, Math.ceil(160 / blurSize1), Math.ceil(120 / blurSize1), screenClone, 0, 0, 160, 120, true, false)
    helpers.imageBlit(screenClone, (tempImg.width * blurSize1 - 160) / -2, (tempImg.height * blurSize1 - 120) / -2, tempImg.width * blurSize1, tempImg.height * blurSize1, tempImg, 0, 0, tempImg.width, tempImg.height, true, false)
    }
    if (zoomSize1 != 1) {
        image1.fillRect(0, 0, 160, 120, 15)
        helpers.imageBlit(image1, x1, y1, 160 * zoomSize1, 120 * zoomSize1, screenClone, 0, 0, 160, 120, true, false)
    } else {
        helpers.imageBlit(image1, 0, 0, 160, 120, screenClone, 0, 0, 160, 120, true, false)
    }
    
})
enum Mode {
    //% block="Center"
    Center,
    //% block="Top-Left"
    TopLeft,
    //% block="Top"
    Top,
    //% block="Top-Right"
    TopRight,
    //% block="Left"
    Left,
    //% block="Right"
    Right,
    //% block="Bottom-Left"
    BottomLeft,
    //% block="Bottom"
    Bottom,
    //% block="Bottom-Right"
    BottomRight
}
//% weight=50 color="#003AFF" icon="\uf125"
//% block="Screen Effects"
//% icon="\uf125"
//% groups='["Static", "Zoom", "Pixelate"]'
namespace screenEffects {
    //% block="set screen zoom to $size times with anchor $anchor || over $ms ms"
    //% weight=2
    //% picker.fieldEditor="gridpicker"
    //% picker.fieldOptions.width=220
    //% picker.fieldOptions.columns=1
    //% picker=Mode
    //% ms.shadow="timePicker"
    //% expandableArgumentMode="toggle"
    //% group=Zoom
    export function SetZoomFilter(size: number, anchor: Mode, ms = 25) {
        if (ms < 25) {
            ms = 25
        }
        memSize1 = size - zoomSize1
        for (let i = 0; i < (ms / 25); i++) {
            zoomSize1 += memSize1 / (ms / 25)
            if (anchor == 0 || anchor == 2 || anchor == 7) {
                x1 = 80 - 80 * zoomSize1
            } else if (anchor == 3 || anchor == 5 || anchor == 8) {
                x1 = 160 - (160 * zoomSize1)
            }
            if (anchor == 0 || anchor == 4 || anchor == 5) {
                y1 = 60 - 60 * zoomSize1
            } else if (anchor == 6 || anchor == 7 || anchor == 8) {
                y1 = 120 - (120 * zoomSize1)
            }
            pause(25)
        }
    }
    //% block="set screen zoom to | $size times | with offset x $x y $y || over $ms ms"
    //% weight=1
    //% ms.shadow="timePicker"
    //% expandableArgumentMode="toggle"
    //% group=Zoom
    export function SetZoomFilterOffset(size: number, x: number, y: number, ms = 25) {
        if (ms < 25) {
            ms = 25
        }
        memSize1 = size - zoomSize1
        for (let j = 0; j < (ms / 25); j++) {
            zoomSize1 += memSize1 / (ms / 25)
            x1 = -x + 80 - zoomSize1 * 80
            y1 = -y + 60 - zoomSize1 * 60
            pause(25)
        }
    }
    //% block="pixelate screen image to pixel size $size || over $ms ms"
    //% weight=2
    //% ms.shadow="timePicker"
    //% expandableArgumentMode="toggle"
    //% group=Pixelate
    export function SetBlurFilter(size: number, ms = 25) {
        if (ms < 25) {
            ms = 25
        }
        memSize1 = size - blurSize1
        for (let j = 0; j < (ms / 25); j++) {
            blurSize1 += memSize1 / (ms / 25)
            pause(25)
        }
    }
    //% block="set screen static effect to $size percent || over $ms ms"
    //% weight=3
    //% ms.shadow="timePicker"
    //% expandableArgumentMode="toggle"
    //% group=Static
    export function SetStaticFilter(size: number, ms = 25) {
        if (size > 100) {
            size = 100
        } else if (size < 0) {
            size = 0
        }
        if (ms < 25) {
            ms = 25
        }
        memSize1 = size - screenStatic
        for (let j = 0; j < (ms / 25); j++) {
            screenStatic += memSize1 / (ms / 25)
            pause(25)
        }
    }
    //% block="create renderable to screen $image on z-layer $z"
    //% draggableParameters="image"
    //% blockAllowMultiple=1
    //% weight=4
    //% group=Advanced
    export function createRenderable(z = 1, handler: (image: Image) => void) {
        scene.createRenderable(z, handler)
    }
    //% block="create buffer with size $size"
    //% weight=5
    //% group=Advanced
    export function createBuffer(size: number) {
        return Buffer.create(size)
    }
    //% block="get row from image $image3 at y $y and put into buffer $buf"
    //% weight=6
    //% group=Advanced
    export function getRowsBlock(image3: any, buf: Buffer, y: number) {
        image3.getRows(y, buf)
    }
    //% block="set row from buffer $buf to image $image at y $y"
    //% weight=7
    //% group=Advanced
    export function setRowsBlock(image: any, buf: Buffer, y: number) {
        image.setRows(y, buf)
    }
}
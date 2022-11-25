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
let bgimg = image.create(0, 0)
let variable = scene.createRenderable(zLayer1, (image1: Image, camera: scene.Camera) => {
    pixelArray = []
    for (let i = 0; i < 15; i++) {
        pixelArray.push(image.screenImage().getPixel(randint(0, 159), randint(0, 119)))
    }
    if (screenStatic > 0) {
        for (let x = 0; x < 160; ++x) {
            x = x / blurSize1
            image1.getRows(x, buf)
            x = x * blurSize1
            repeat = Math.ceil(screenStatic / 120 + randint(screenStatic, -100) / 100)
            for (let y = 0; y < repeat; ++y) {
                buf[randint(0, 119)] = pixelArray[randint(0, 14)]
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
        if (zoomSize1 < 1) {
            image1.fillRect(0, 0, 160, 120, 15)
            helpers.imageBlit(image1, 0, 0, 160, 120, bgimg, 0, 0, 160, 120, true, false)
        }
        helpers.imageBlit(image1, x1, y1, 160 * zoomSize1, 120 * zoomSize1, screenClone, 0, 0, 160, 120, true, false)
    } else {
        helpers.imageBlit(image1, 0, 0, 160, 120, screenClone, 0, 0, 160, 120, true, false)
    }

})
enum Mode {
    //% block="center"
    Center,
    //% block="top-left"
    TopLeft,
    //% block="top"
    Top,
    //% block="top-right"
    TopRight,
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="bottom-left"
    BottomLeft,
    //% block="bottom"
    Bottom,
    //% block="bottom-right"
    BottomRight
}
//% weight=50 color="#003AFF" icon="\uf125"
//% block="Screen Effects"
//% icon="\uf125"
//% groups='["Zoom", "Pixelate", "Static", "Advanced"]'
namespace screenEffects {
    //% block="set screen zoom to $size times with anchor $anchor || over $ms ms"
    //% weight=12
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
    //% weight=11
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
    //% block="set zoomed out background image to $image"
    //% weight=10
    //% group=Zoom
    export function SetZoomedOutBackground(image: any) {
        bgimg = image
    }
    //% block="pixelate screen image to pixel size $size || over $ms ms"
    //% weight=20
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
    //% weight=30
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
    //% weight=45
    //% group=Advanced
    export function createRenderable(z = 1, handler: (image: Image) => void) {
        scene.createRenderable(z, handler)
    }
    //% block="create buffer with size $size"
    //% weight=44
    //% group=Advanced
    export function createBuffer(size: number) {
        return Buffer.create(size)
    }
    //% block="get rows from image $image at x $x to buffer $buf"
    //% image.shadow=screen_image_picker
    //% weight=43
    //% group=Advanced
    export function getRowsBlock(image: Image, x: number, buf: Buffer) {
        image.getRows(x, buf)
    }
    //% block="set rows from buffer $buf to image $image at x $x"
    //% image.shadow=screen_image_picker
    //% weight=42
    //% group=Advanced
    export function setRowsBlock(image: Image, x: number, buf: Buffer) {
        image.setRows(x, buf)
    }
    //% block="set value in buffer $buf at index $index to $value"
    //% weight=40
    //% group=Advanced
    export function setBufferValueBlocks(buf: Buffer, index: number, value: number) {
        buf[index] = value
    }
    //% block="get value in buffer $buf at index $index"
    //% weight=41
    //% group=Advanced
    export function getBufferValueBlocks(buf: Buffer, index: number) {
        return buf[index]
    }
}
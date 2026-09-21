// Encodes footage for the site as a silent H.264 MP4, plus a lossless PNG of its
// first frame for the poster. macOS only: it uses AVFoundation, so it needs no
// ffmpeg — but it can't make WebM.
//
//   swift scripts/encode-video.swift <in> <out.mp4> <poster.png> --size WxH [options]
//
//   --size WxH      output size (required)
//   --crop X,Y,W,H  source area to keep, from the top-left; default the whole frame
//   --bitrate BPS   average bits per second; default 1000000
//   --max SECONDS   keep only the first SECONDS of the source
//   --gray          black and white: the source's own BT.709 luma, so it matches
//                   the colour version's lightness exactly
//   --fade FRAMES   a seamless loop: the clip opens at source frame FRAMES, and
//                   its last FRAMES frames dissolve into frames 0…FRAMES-1, so the
//                   final frame leads straight into the first
//
// Audio is always dropped. Pixel values pass straight through (colour management
// off), and the file is tagged BT.709 with its index up front, so playback can
// start before the download finishes. The poster PNG is the first frame of the
// output; make the JPEG from it (see README, Visual content).
import AVFoundation
import CoreImage
import Foundation

var positional: [String] = []
var opts: [String: String] = [:]
var args = CommandLine.arguments.dropFirst().makeIterator()
while let arg = args.next() {
  if arg == "--gray" { opts["gray"] = "1" }
  else if arg.hasPrefix("--") { opts[String(arg.dropFirst(2))] = args.next() }
  else { positional.append(arg) }
}
guard positional.count == 3, let size = opts["size"]?.split(separator: "x").compactMap({ Int($0) }), size.count == 2 else {
  fatalError("usage: encode-video.swift <in> <out.mp4> <poster.png> --size WxH [--crop X,Y,W,H] [--bitrate BPS] [--max SECONDS] [--gray] [--fade FRAMES]")
}
let inURL = URL(fileURLWithPath: positional[0]), outURL = URL(fileURLWithPath: positional[1]), posterURL = URL(fileURLWithPath: positional[2])
let outW = size[0], outH = size[1]
let bitrate = Int(opts["bitrate"] ?? "1000000")!
let fade = Int(opts["fade"] ?? "0")!
let gray = opts["gray"] != nil

let asset = AVURLAsset(url: inURL)
let track = asset.tracks(withMediaType: .video)[0]
let fps = Int32(track.nominalFrameRate.rounded())
let srcW = Double(track.naturalSize.width), srcH = Double(track.naturalSize.height)
let crop = opts["crop"].map { $0.split(separator: ",").map { Double($0)! } } ?? [0, 0, srcW, srcH]
var total = Int((Double(fps) * CMTimeGetSeconds(asset.duration)).rounded())
if let max = opts["max"].flatMap(Double.init) { total = min(total, Int((max * Double(fps)).rounded())) }
let n = total - fade // frames written

let reader = try AVAssetReader(asset: asset)
let rOut = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
rOut.alwaysCopiesSampleData = false
reader.add(rOut)
reader.startReading()

try? FileManager.default.removeItem(at: outURL)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: outW,
  AVVideoHeightKey: outH,
  AVVideoColorPropertiesKey: [
    AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
    AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
    AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
  ],
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: bitrate,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoH264EntropyModeKey: AVVideoH264EntropyModeCABAC,
    AVVideoAllowFrameReorderingKey: true,
    AVVideoMaxKeyFrameIntervalKey: Int(fps) * 4,
    AVVideoExpectedSourceFrameRateKey: Int(fps),
  ],
])
wIn.expectsMediaDataInRealTime = false
let bufAttrs: [String: Any] = [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: outW,
  kCVPixelBufferHeightKey as String: outH,
  kCVPixelBufferIOSurfacePropertiesKey as String: [:] as [String: Any],
]
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: wIn, sourcePixelBufferAttributes: bufAttrs)
writer.add(wIn)
guard writer.startWriting() else { fatalError("writer: \(String(describing: writer.error))") }
writer.startSession(atSourceTime: .zero)

let ctx = CIContext(options: [.workingColorSpace: NSNull(), .outputColorSpace: NSNull()])
let outRect = CGRect(x: 0, y: 0, width: outW, height: outH)
let luma = CIVector(x: 0.2126, y: 0.7152, z: 0.0722, w: 0)

func process(_ pb: CVPixelBuffer) -> CIImage {
  // Core Image's origin is bottom-left.
  let r = CGRect(x: crop[0], y: srcH - crop[1] - crop[3], width: crop[2], height: crop[3])
  var img = CIImage(cvPixelBuffer: pb).cropped(to: r).clampedToExtent()
    .transformed(by: CGAffineTransform(translationX: -r.minX, y: -r.minY))
  if Double(outW) != crop[2] {
    let scale = CIFilter(name: "CILanczosScaleTransform")!
    scale.setValue(img, forKey: kCIInputImageKey)
    scale.setValue(Double(outW) / crop[2], forKey: kCIInputScaleKey)
    scale.setValue(1.0, forKey: kCIInputAspectRatioKey)
    img = scale.outputImage!
  }
  if gray {
    let matrix = CIFilter(name: "CIColorMatrix")!
    matrix.setValue(img, forKey: kCIInputImageKey)
    for k in ["inputRVector", "inputGVector", "inputBVector"] { matrix.setValue(luma, forKey: k) }
    matrix.setValue(CIVector(x: 0, y: 0, z: 0, w: 1), forKey: "inputAVector")
    matrix.setValue(CIVector(x: 0, y: 0, z: 0, w: 0), forKey: "inputBiasVector")
    img = matrix.outputImage!
  }
  return img.cropped(to: outRect)
}

func newBuffer() -> CVPixelBuffer {
  var pb: CVPixelBuffer?
  CVPixelBufferCreate(nil, outW, outH, kCVPixelFormatType_32BGRA, bufAttrs as CFDictionary, &pb)
  return pb!
}

var head: [CVPixelBuffer] = [] // processed source frames 0..<fade, for the dissolve
var outIdx = 0
func emit(_ img: CIImage) {
  while !wIn.isReadyForMoreMediaData { usleep(2000) }
  var pb: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
  ctx.render(img, to: pb!)
  if outIdx == 0 {
    try! ctx.writePNGRepresentation(of: CIImage(cvPixelBuffer: pb!), to: posterURL, format: .RGBA8,
                                    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
  }
  guard adaptor.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(outIdx), timescale: fps)) else {
    fatalError("append \(outIdx): \(String(describing: writer.error))")
  }
  outIdx += 1
}

var idx = 0
while idx < total, let sb = rOut.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  let img = process(pb)
  if idx < fade {
    let keep = newBuffer()
    ctx.render(img, to: keep)
    head.append(keep)
  } else if idx < n {
    emit(img)
  } else {
    let k = idx - n
    let mix = CIFilter(name: "CIDissolveTransition")!
    mix.setValue(img, forKey: kCIInputImageKey)
    mix.setValue(CIImage(cvPixelBuffer: head[k]), forKey: kCIInputTargetImageKey)
    mix.setValue(Double(k + 1) / Double(fade + 1), forKey: kCIInputTimeKey)
    emit(mix.outputImage!.cropped(to: outRect))
  }
  idx += 1
}
reader.cancelReading()

wIn.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
if writer.status != .completed { fatalError("finish: \(String(describing: writer.error))") }
let bytes = (try FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as! NSNumber).doubleValue
let secs = Double(outIdx) / Double(fps)
print(String(format: "%@  %dx%d  %.2fs  %.2f MB  %.2f Mbps", outURL.lastPathComponent, outW, outH, secs, bytes / 1_000_000, bytes * 8 / secs / 1_000_000))

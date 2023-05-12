// import { grpc } from "@improbable-eng/grpc-web";
//
// import * as uploadpb from "pb/ts/upload/v1/upload_service_pb_service";
// import { GetPresignURLRequest, GetPresignURLResponse, SuccessAudioUploadRequest, SuccessAudioUploadResponse } from "pb/ts/upload/v1/upload_service_pb";
//
// import { GRPC_GATEWAY } from '~/env';
// import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
// import * as audiopb from "pb/ts/audio/v1/audio_service_pb";
//
// grpc.setDefaultTransport(NodeHttpTransport());
//
// export class UploadError extends Error {
//     constructor(public code: number, message: string) {
//         super(message)
//     }
// }
//
// export class UploadService {
//
//     constructor(identityContext /* Should it be outside react context? */ = undefined) {
//     }
//
//     getUploadUrl(bucket: string, filename: string): Promise<GetPresignURLResponse.AsObject> {
//         const request = new GetPresignURLRequest();
//         request.setBucket(bucket);
//         request.setFilename(filename);
//
//         return new Promise((resolve, reject) => {
//             const client = grpc.unary(uploadpb.UploadService.GetPresignURL, {
//                 host: GRPC_GATEWAY, request, onEnd(response) {
//                     client.close();
//
//                     if (grpc.Code.OK != response.status)
//                         reject(response.statusMessage)
//                     else
//                         resolve(response.message.toObject() as GetPresignURLResponse.AsObject)
//                 },
//             });
//         });
//     }
//
//     successAudioUpload(bucket: audiopb.AudioBucket, audio: audiopb.Audio): Promise<SuccessAudioUploadResponse> {
//         const request = new SuccessAudioUploadRequest();
//         request.setAudio(audio);
//         request.setBucket(bucket);
//
//         return new Promise((resolve, reject) => {
//             const client = grpc.unary(uploadpb.UploadService.SuccessAudioUpload, {
//                 host: GRPC_GATEWAY, request, onEnd(response) {
//                     client.close();
//
//                     switch (response.status) {
//                         case grpc.Code.OK:
//                             resolve(response.message.toObject() as SuccessAudioUploadResponse)
//                             break;
//
//                         case grpc.Code.AlreadyExists:
//                             reject(new UploadError(409, response.statusMessage))
//
//                         default:
//                             reject(response.statusMessage)
//                     }
//                 }
//             });
//         });
//     }
// }

// import { grpc } from "@improbable-eng/grpc-web";
// import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
// import { CreateAudioBucketResponse, CreateAudioBucketRequest, ListAudiosResponse, ListAudiosRequest } from "pb/ts/audio/v1/audio_service_pb";
// import * as audiopb from "pb/ts/audio/v1/audio_service_pb_service";
// import { GRPC_GATEWAY } from "~/env";
//
// grpc.setDefaultTransport(NodeHttpTransport());
//
// export class AudioService {
//
//     listAudios(): Promise<ListAudiosResponse.AsObject> {
//         return new Promise((resolve, reject) => {
//             const request = new ListAudiosRequest();
//
//             const client = grpc.unary(audiopb.AudioService.ListAudios, {
//                 host: GRPC_GATEWAY, request, onEnd(response) {
//                     client.close();
//
//                     if (grpc.Code.OK != response.status)
//                         reject(response.statusMessage)
//                     else
//                         resolve(response.message.toObject() as ListAudiosResponse.AsObject)
//                 }
//             });
//         })
//     }
//
//     createBucket(): Promise<CreateAudioBucketResponse.AsObject> {
//         // TODO: Make util for promise
//         return new Promise((resolve, reject) => {
//             const request = new CreateAudioBucketRequest();
//
//             const client = grpc.unary(audiopb.AudioService.CreateAudioBucket, {
//                 host: GRPC_GATEWAY, request, onEnd(response) {
//                     client.close();
//
//
//                     if (grpc.Code.OK != response.status)
//                         reject(response.statusMessage)
//                     else
//                         resolve(response.message.toObject() as CreateAudioBucketResponse.AsObject)
//                 },
//             })
//         });
//     }
// }

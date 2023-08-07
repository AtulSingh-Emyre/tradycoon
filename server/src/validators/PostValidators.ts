// import {body, param, query} from 'express-validator';
// import Post from '../models/mongoDB/AnalystPostBuySell';

// export class PostValidators {
//   static deletePost() {
//     return [
//       param('id').custom((id, {req}) => {
//         return Post.findOne({_id: id}, {__v: 0, user_id: 0}).then((post) => {
//           if (post) {
//             req.post = post;
//             return true;
//           } else {
//             throw new Error('Post Does Not Exist');
//           }
//         });
//       }),
//     ];
//   }
// }

const { database } = require('../config/db.js')

exports.read = (req, res) => {
  // console.log("read",req);
  // console.log(res);
  const userId = req.params.id;
  //console.log("userid in read", userId);
  database
    .table('users')
    .withFields(['id', 'first_name', 'last_name', 'email', 'user_role'])
    .filter({ id: userId })
    .get()
    .then(result => {
      console.log("result",result);
      if (result) {
        res.json(result)
      } else {
        return res.status(400).json({
          error: 'User not found'
        })
      }
    })
}

exports.update = (req, res) => {
  const updateuserId = req.params.id;
  const {first_name} = req.body;
  if (!updateuserId) {
    return res.status(400).json({
      error : "Id required"
    })
  }
  if (!first_name || first_name =="") {
    return res.status(400).json({
      error : "Name is required"
    })
  }
  database.table('users')
    .filter({ id: updateuserId })
    .update({
      first_name: first_name
    })
    .then(updateStatus => {
      
      if (!updateStatus) {
        console.log("User update error");
        return res.status(400).json({
          error : "Update failed"
        })
      }else{
        const data={
          params:{
            id:updateuserId
          }
        }
        //data.params.id = updateuserId;
        this.read(data,res);
      }
    })
   
}
// module.exports ={
//   async read (req, res) {
//     console.log("read",req)
//     const userId = req.params.id;
//     console.log("userid in read", userId);
//     const test = await database
//       .table('users')
//       .withFields(['id', 'first_name', 'last_name', 'email', 'user_role'])
//       .filter({ id: userId })
//       .get()
//       .then(result => {
//         console.log("result",result);
//         if (result) {
//           res.json(result)
//         } else {
//           return res.status(400).json({
//             error: 'User not found'
//           })
//         }
//       })
//       return test;
//   },
//   async update (req, res) {
//     console.log(req.params)
//     console.log(req.body)
//     const updateuserId = req.params.id;
//     const {name} = req.body;
//     if (!updateuserId) {
//       return res.status(400).json({
//         error : "Id required"
//       })
//     }
//     if (!name || name =="") {
//       return res.status(400).json({
//         error : "Name is required"
//       })
//     }
//     database.table('users')
//       .filter({ id: updateuserId })
//       .update({
//         first_name: name
//       })
//       .then(updateStatus => {
        
//         if (!updateStatus) {
//           console.log("User update error");
//           return res.status(400).json({
//             error : "Update failed"
//           })
//         }else{
         
//         }
//       })
//        const data={
//             params:{}
//           }
//           data.params.id = updateuserId;
//           ret = await read(data);
//           return ret;
//   }
// }
var db=require('../config/connection')
var collection=require('../config/collection');
const { response } = require('express');
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
     console.log(product);
     product.Price=parseInt(product.Price)
     db.get().collection('product').insertOne(product).then((data)=>{
     

       callback(data.ops[0]._id) 
     })
    },
    getAllProducts:()=>{
      return new Promise(async(resolve,reject)=>{
        let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(products)


      })

    },
    deleteProduct:(proId)=>{
      return new Promise((resolve,reject)=>{
        console.log(proId);
        console.log(objectId(proId));
        db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
         // console.log(response);
          resolve(response)
        })
      })
    },
    getProductDetails:(proId)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
          resolve(product)
        })
      })
    },
    updateProduct:(proId,proDetails)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION)
        .updateOne({_id:objectId(proId)},{
          $set:{
            Name:proDetails.Name,
            Description:proDetails.Description,
            Price:parseInt(proDetails.Price),
            Category:proDetails.Category

          }
        }).then((response)=>{
          resolve()
        })
      })
    },
    adminSignup: (adminData) => {
      return new Promise(async (resolve, reject) => {
          adminData.password = await bcrypt.hash(adminData.password, 10)
          db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
              resolve(data.ops[0])
          })

      })
    },

    adminLogin: (adminData) => {
      console.log(adminData)
      return new Promise(async (resolve, reject) => {
          let loginstatus = false
          let response = {}
          let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
          if (admin) {
              bcrypt.compare(adminData.password, admin.password).then((status) => {
                  if (status) {

                      console.log('Login Success');
                      response.admin = admin
                      response.status = true
                      resolve(response)
                  } else {
                      console.log('Login Failed')
                      resolve({ status: false })
                  }
              })

          } else {
              console.log('Login Failed')
              resolve({ status: false })
          }


      })
  }
    
    

}
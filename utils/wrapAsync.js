// function wrapAsync(fn){
//  return function(req,res,next)
//  {
//     fn(req,res).catch(next)
//  }
// }


//Arrow function
// const wrapAsync=(fn)=>{
//  return (req,res,next)=>
//  {
//     fn(req,res).catch(next)
//  }
// }

// module.exports=wrapAsync;



module.exports=wrapAsync=(fn)=>{
 return (req,res,next)=>
 {
    fn(req,res).catch(next)
 }
}

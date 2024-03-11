import  express from 'express'
import Reviews from '../models/reviewsModel.js'
import { isAuth, isAdmin } from "../utils.js"

const reveiewsRouter = express.Router();
//CREATE

reveiewsRouter.post("/create", isAuth, async (req,res)=>{
    // console.log(req.body)
    try{
        const newReview=new Reviews(req.body)
        const savedReview=await newReview.save()
        res.status(200).json(savedReview)
    }
    catch(err){
        res.status(500).json(err)
    }
     
})

//UPDATE
reveiewsRouter.put("/:id", isAuth, async (req,res) => {
    try{
       
        const updatedReview=await Reviews.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedReview)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
reveiewsRouter.delete("/:id", isAuth, async (req,res)=>{
    try{
        await Reviews.findByIdAndDelete(req.params.id)
        
        res.status(200).json("Review has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET PRODUCT REVIEWS
reveiewsRouter.get("/product/:productId",async (req,res)=>{
    console.log(req.params.productId)
    try{
        const reviews=await Reviews.find({productId :req.params.productId})
        console.log(reviews)
        res.status(200).json(reviews)
    }
    catch(err){
        res.status(500).json(err)
    }
})


export default reveiewsRouter
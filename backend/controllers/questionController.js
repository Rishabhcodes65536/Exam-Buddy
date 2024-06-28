import mongoose from "mongoose"
import axios from "axios"
import crypto from "crypto"
import questionModel from "../models/question.js";
import ejsLint from 'ejs-lint'
import MetaquestionModel from "../models/metacognition.js";

class questionController{    

    static getModes=async (req,res)=>{
        res.render('quiz.ejs',{
            "user":req.session.name.split(' ')[0]
        });
    }
    static getTopics=async (req,res,API_ENDPOINT)=>{
    const modeName = req.params.mode;
    const topics = [
    { id: 1, name: 'Differentiation' },
    { id: 2, name: 'Integration' },
    { id: 3, name: 'Algebra' },
    { id: 4, name: 'Geometry' },
    { id: 5, name: 'Trigonometry' },
    { id: 6, name: 'Statistics' },
    { id: 7, name: 'Probability' },
    { id: 8, name: 'Linear Algebra' },
    { id: 9, name: 'Number Theory' }
    ];
    console.log(req.session._id);
    console.log(modeName);
    if (req.session._id) {
            res.render('topic.ejs', { topics, "id":req.session._id,"user":req.session.name.split(' ')[0],"mode":modeName});
    }
    else{
        res.render("login.ejs");
    }

    // res.render('dashboard.ejs',{"user":req.session._id});
}
    static fetchApi = async (req, res) => {
    let retryCount = 0;
    const maxRetry = 3; 
    while (retryCount < maxRetry) {
        try {
            const latestQuestion = await questionModel.find({ topic: req.query.topic, student_id: req.session._id }).sort({ attempted_at: -1 }).limit(1);
            const retryLatestQuestion = latestQuestion[0];
            const past_question = latestQuestion[0] ? (latestQuestion[0].question) : ("");
            const API_ENDPOINT = req.API_ENDPOINT;
            let parsed_string = "";

            if (req.query.retry) {
                parsed_string = retryLatestQuestion;
                parsed_string.marks = retryLatestQuestion.total_marks;
            } else {
                let response = await axios.post(API_ENDPOINT, {
                    question: req.query.topic + " problem",
                    past_question,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                parsed_string = response.data.response;
            }

            if (parsed_string && parsed_string.question) {
                req.question = parsed_string.question;
                req.marks = parseInt(parsed_string.marks);
                res.render('\answer.ejs', {
                    "student_id":req.session._id,
                    "data": parsed_string,
                    "topic": req.query.topic,
                });
                return; 
            } else {
                console.log("Parsed string not found.");
                retryCount++;
            }
        } catch (err) {
            console.log(err);
            retryCount++;
        }
    }


    console.log("Max retry attempts reached.");
    res.redirect(req.get('referer'));
}
    static fetchMetaApi = async (req, res) => {
      let retryCount = 0;
      const maxRetry = 3; 
      while (retryCount < maxRetry) {
        try {
          const Question = req.query.topic;
          const response = await axios.post(req.API_ENDPOINT, {
            question: Question,
          });
          let isQuestion = response.data.response.question;
          if (isQuestion) {
            console.log("yepp");
            const { question, steps, marks } = response.data.response;
            console.log(steps);

            const orderedSteps = steps.sort((a, b) => a.order - b.order);
            console.log("Ordered_steps=" + JSON.stringify(orderedSteps));
            const rishabhPerm = [];
            for (let i = 0; i < orderedSteps.length; i++) {
              rishabhPerm.push(i);
            }
            for (let i = rishabhPerm.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [rishabhPerm[i], rishabhPerm[j]] = [
                rishabhPerm[j],
                rishabhPerm[i],
              ];
            }


            const correctOrder = rishabhPerm.map((index) => index + 1);

            const pairedSteps = orderedSteps.map((step, index) => ({
              step,
              rishabhPerm: rishabhPerm[index],
            }));

            
            pairedSteps.sort((a, b) => a.rishabhPerm - b.rishabhPerm);
            console.log(rishabhPerm);
            console.log(pairedSteps);
            
            const solutionStepsArray = [];
            for (const pairedStep of pairedSteps) {
              solutionStepsArray.push(pairedStep.step.solution_step);
            }

            
            console.log(solutionStepsArray);
            console.log(correctOrder);
            
            const quotedStrings = solutionStepsArray.map((step) => `"${step}"`);

            
            const joinedString = quotedStrings.join("|");

            
            const newArray = joinedString.split("|"); 
            const finalArray = newArray.map((item) =>
              item.replace(/^"(.*)"$/, "$1")
            );
            console.log(solutionStepsArray);
            console.log(correctOrder);
            res.render("metacognition.ejs", {
              question,
              steps: finalArray,
              correctOrder,
              topic: Question,
              total_marks: marks,
            });
              return;
          } else {
            console.log("NOPEE!!");
            // res.redirect(req.get("referer"));
            retryCount++;
          }
        } catch (error) {
          retryCount++; 
        }
      }
      console.log("Max retry attempts reached.");
      res.redirect(req.get("referer"));
    }



static handleSolution = async (req, res) => {
    let retryCount = 0;
    const maxRetry = 3; 

    while (retryCount < maxRetry) {
        try {
            console.log("Attempt:", retryCount + 1);
          
            console.log(req.body);
            const { solution, question, marks, final_answer } = req.body;
            if (!solution) {
                solution = "";
            }
            if (!final_answer) {
                final_answer = "";
            }

            
            const SOLUTION_API = req.SOLUTION_API_ENDPOINT;
            const response_from_api = await axios.post(SOLUTION_API, {
                question: question,
                marks: marks,
                answer: solution,
                final_answer: final_answer
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
            console.log(response_from_api.data);
            const questionDoc = new questionModel({
                student_id: req.session._id,
                question: question,
                student_response: solution,
                topic: req.query.topic,
                total_marks: marks,
                allocated_marks: response_from_api.data.response.marks_awarded_to_student,
                feedback: response_from_api.data.response.feedback,
                final_answer: final_answer
            })
            const mongodbSaving = await questionDoc.save();
            console.log(mongodbSaving);
            req.session.answer_attempted = true;
            const obj = {
                question: question,
                marks: marks
            }
            console.log(req.body.topic);
            res.render('answer.ejs', {
                "student_id":req.session._id,
                "data": obj,
                "topic": req.body.topic,
                "abcd": response_from_api.data,
                "user_solution": solution,
                "final_answer": final_answer
            });
            return; 
        } catch (error) {
            console.error('Error:', error);
            retryCount++; 
        }
    }
    console.log("Max retry attempts reached.");
    res.status(500).send('Internal Server Error');
}

    static handleMetaSolution=async (req,res)=>{
        try {
        console.log(req.body);
        const { question, steps, correctOrder, topic, total_marks,userResponse} = req.body;
        console.log(question,steps,correctOrder,topic,total_marks,userResponse);
        const submittedOrder = req.body.userResponse.map(Number);
        const correctOrderArray = Array.isArray(correctOrder) ? correctOrder : correctOrder.split(',');
        const correctOrderNumbers = correctOrderArray.map(Number);
        let isCorrect = true;
        const rishabhArray = [];
        for(var i=0;i<correctOrder.length;i++){
            rishabhArray.push(0);
        }
        const newsteps=[];
        for (let i = 0; i < correctOrder.length; i++) {
        if (correctOrderNumbers[i] != userResponse[i]) {
            console.log(correctOrderNumbers[i]);
            console.log(userResponse[i]);
            isCorrect = false;
        }
        else{
            rishabhArray[correctOrderArray[i]-1]=1;
        }
        }
        console.log(newsteps);
        console.log(question,steps,correctOrder,correctOrderNumbers,topic,total_marks,submittedOrder,isCorrect);
        let allocated_marks=0;
        if(isCorrect){
            allocated_marks=total_marks;
        }
        const rishData=[];
        console.log(rishabhArray);
        var feedback="";
        if(isCorrect){
            feedback="Correct Answer!!";
        }
        else{
            feedback="Wrong answer!!";
        }
        const questionDoc= new questionModel({
            student_id:req.session._id,
            question:question,
            student_response:JSON.stringify(steps),
            topic:topic,
            total_marks:total_marks,
            allocated_marks:allocated_marks,
            feedback:feedback,
            mode:'metacognition'
        })
        const mongoSving=await questionDoc.save();
        console.log(mongoSving);
        req.session.meta_attempted = true;
        res.render('metacognition.ejs', { 
            question, 
            steps:steps, 
            correctOrder:correctOrderNumbers, 
            topic,
            total_marks,
            submittedOrder,
            isCorrect,
            allocated_marks,
            rishabhArray
        });
    } catch (error) {
        console.error('Error handling metacognition solution:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    } 

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    static hashOrder(orderedSteps) {
        const orderedSolutionSteps = orderedSteps.map(step => step.solution_step).join(',');
        return crypto.createHash('sha256').update(orderedSolutionSteps).digest('hex');
    }
}

export default questionController;
'use strict';
var _ = require("lodash");
var express = require('express');
var _ = require('lodash')
var moment = require('moment')
var   { getTeams,getTeamById,addTeam,editTeam,removeTeam } = require('../models/teams')
const { check, validationResult,checkSchema } = require('express-validator');


var app  = express.Router();


app.get('/',function(req,res){

  getTeams()
  .then(function(response){
    console.log(response)
    res.status(200).json(response)

  })
  .catch(function(err){
    console.log(err);
    res.status(500).json({error:"Server error. Try again."})
  })
})

app.get('/:idTeam',function(req,res){
  var idTeam = req.params.idTeam

  getTeamById(idTeam)
  .then(function(response){
    console.log(response)
    if(response.length > 0){
    var output = {}

    output['id']= response[0].team,
    output['name']= response[0].team_name,
    output['members'] = _.map(response,function(value){
      return {
        id: value.id,
        name: value.name,
        email: value.email,
        image: value.image,
        team_id: value.team_id

      }
    })

    res.status(200).json(output)
  }else{
    res.status(404).json({error:"Entity not found"})
  }

  })
  .catch(function(err){
    console.log(err);
    res.status(500).json({error:"Server error. Try again"})
  })

})

app.post("/",[
  // name must be String
  check('name').isString(),
  // password must be at least 5 chars long
  //check('password').isLength({ min: 5 })
],function(req,res){

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'The name field is required' });
  }

    var team = req.body

    team['created_at'] = moment().format('YYYY-MM-DD HH:mm:ss');
    team['updated_at'] = moment().format('YYYY-MM-DD HH:mm:ss');
    addTeam(team)
    .then(function(response){
      console.log(response)

      res.status(201).json({id:response[0],name:req.body.name})

    })
    .catch(function(err){
      console.log(err);
      res.status(500).json({error:"Server error."})
    })
})


var rules = {
  id: {
    // The location of the field, can be one or more of body, cookies, headers, params or query.
    // If omitted, all request locations will be checked
    in: ['params'],
    errorMessage: 'ID is wrong',
    isInt: true,
    // Sanitizers can go here as well
    toInt: true
  },
  name: {
    in: 'body',
    errorMessage:"Required",
    isString:true
  }
}

app.put("/:id",checkSchema(rules),function(req,response){

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return response.status(400).json({ error: 'The name field is required' });
  }
    var team = req.body
    team['id'] = req.params.id

    team['updated_at'] = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(team)
    editTeam(team)
    .then(function(respuesta){
      console.log(respuesta)
      if(respuesta[0]){
        response.status(201).json({id:team.id,name:req.body.name})

      }else{
        console.log("Id No encontrado")
        response.status(404).json({error:"The id of the team was not found."})
      }

    })
    .catch(function(err){
      console.log(err);
      response.status(500).json({error:"Server error. Try again."})
    })
})

app.delete('/:idTeam',function(req,response){

  removeTeam(parseInt(req.params.idTeam))
  .then(function(respuesta){
     if(respuesta){
       response.status(204).json()
     }else{
    //   console.log("Id No encontrado")
       response.status(404).json({error:"Entity not found."})
    }

  })
  .catch(function(err){
    console.log(err);
    response.status(404).json({error:"Server error. Try again."})
  })
})

app.use(function(req,res,next){
  response.status(404).json({error:"Server error. Try again."})
})
module.exports = app

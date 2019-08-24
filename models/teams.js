
const { Client } = require('mysql2')

const options = {
  client: 'mysql2',
  connection: {
      host: process.env.HOST,
      user: process.env.DBUSER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
  },
  pool: { min: 0, max: 2 }
}


exports.getTeams = async(companyList) => ( await (() => (
    new Promise((resolve, reject) =>{

    const knex = require('knex')(options)
     knex({a:'teams'})
      .select()
      // .where('g.idCompany', 'in', companyList)
       .orderBy('a.id','asc')
     // .toString()
     .then((response) =>{
        resolve(response)
     })
     .catch((error) => {
       reject(error)
     })
     .finally(() => { knex.destroy(); })
    })
  ))())

  exports.getTeamById = async(idTeam) => ( await (() => (
      new Promise((resolve, reject) =>{

      const knex = require('knex')(options)
       knex({a:'teams'})
        .select([{team:'a.id'},{team_name:'a.name'},'b.id','b.email','b.image','b.team_id'])
        .join({b:'members'},'a.id','=','b.team_id')
         .where('a.id', '=', idTeam)
         .orderBy('a.id','asc')
       .then((response) =>{
            resolve(response)
       })
       .catch((error) => {
         reject(error)
       })
       .finally(() => { knex.destroy(); })
      })
    ))())


    exports.addTeam = async (newTeam) => (await (() => (
      new Promise((resolve, reject)  => {

        const knex = require('knex')(options);
        var SQL = knex('teams')

        .insert(newTeam)
        .then((response)=>resolve(response))
        .catch((err) =>  reject(err))

        })

    )) () )


    exports.editTeam = async (team) => (await (() => (
      new Promise((resolve, reject)  => {

        const knex = require('knex')(options);
        var SQL = knex('teams')
        .where({ id: team.id })
        .update({ name: team.name, 'updated_at':team['updated_at'] })
        .then((response)=>resolve(response))
        .catch((err) => reject(err))

        })

    )) () )

    exports.removeTeam = async (idTeam) => (await (() => (
      new Promise((resolve, reject)  => {

        const knex = require('knex')(options);
        var SQL = knex('teams')
        .where({ id: idTeam })
        .del()
        .then((response)=>{
          if(parseInt(response)){
          resolve(true)
        }else{
          resolve(false)
        }
      })
        .catch((err) => reject(err))

        })

    )) () )

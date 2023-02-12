// OBSOLETE FILE, NOT FOLLOWING CURRENT IDEAS, Change the endpoints to new model !

import express from "express";
import knex from "../../db/index.js";

import { validationResult } from "express-validator";

// importing self-made response/error handlers from /errorHandlers/index.js
import {successHandler, 
  requestErrorHandler,  
  databaseErrorHandler,
  validationErrorHandler,
} from "../../responseHandlers/index.js";

import {validateAddMember} from '../../validationHandler/index.js'

const member = express.Router();

//GET all contributors
// http://localhost:PORT/api/member/all/contributors

member.get("/old/all/contributors", function (req, res) {
  let subquery = knex("Idea_Member").distinct("memberId");
  knex('Member').whereIn('id', subquery)
  .then(data => {
    successHandler(res, data, "member.get/all: Mebers listed ok from DB");
  })
  .catch((error) => {
    if(error.errno===1146) {
      databaseErrorHandler(res, error, "member.get/all: Database table Member not created. ");
    } else {
      databaseErrorHandler(res, error, "member.get/all: ");
    }
  });
});

member.get("/all/contributors", function (req, res) {
  knex
    .select()
    .from("Member")
    .then(data => {
      successHandler(res, data, "member.get/all: Contributors listed ok from DB");
    })
    .catch((error) => {
      if(error.errno===1146) {
        databaseErrorHandler(res, error, "member.get/all: Database table Member not created. ");
      } else {
        databaseErrorHandler(res, error, "member.get/all: ");
      }
    });
});

//GET all members
// http://localhost:PORT/api/member/all

member.get("/all", function (req, res) {
  knex
    .select()
    .from("Member")
    .then(data => {
      successHandler(res, data, "member.get/all: everything listed ok from DB")
    })
    .catch(error => {
      if(error.errno===1146) {
        databaseErrorHandler(res, error, "member.get/all: Database table Member not created. ");
      } else {
        databaseErrorHandler(res, error, "member.get/all: ");
      }
    });
});

// ADD NEW MEMBER
/** http://localhost:PORT/api/member/    with method=POST **/

member.post("/", validateAddMember ,function (req, res) {
  
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return validationErrorHandler(res, valResult, "validateAddMember error");
  }
  // Just a start of err handling for model for you
  if (req.body.firstName && req.body.lastName && req.body.email) {
    knex
      .insert(req.body)
      .returning("*")
      .into("Member")

      .then(data => {
        console.log(data);
        res.status(200);
        res.send({    // should maybe be just send(data)
          id: data    // that would return e.g. [104]
        });
      })
      .catch(error => {
          if (error.errno == 1062) {
          // https://mariadb.com/kb/en/library/mariadb-error-codes/
          requestErrorHandler(res, "Conflict: Member with that name already exists!")
          }
         else if (error.errno == 1054) {         
          //to handle error for backend only
          requestErrorHandler(res, "error in spelling [either in 'firstName' and/or in 'lastname' and or in 'email'].")
        } else {
          databaseErrorHandler(res, error);
        }
      });
  } else {
    res.status(400);
    res.send(
      JSON.stringify({
        error: "first name and /or last name and/or email is missing."
      })
    );
  }
});

// members by id --
/** http://localhost:PORT/api/member/    with method=GET **/
// example: http://localhost:PORT/api/member/1
// This was somehow checked/fixed 2020-02-25
member.get("/:id", function (req, res) {
  let id = Number(req.params.id);
  if (id && !isNaN(id) && id > 0) {
    knex
      .select()
      .from("Member")
      .where("id", id)
      .then(data => {
        if (data.length == 1) {
          successHandler(res, data);
        } else {
          requestErrorHandler(res, "Member with id: " + req.params.id + " was not found!");
        }
      })
      .catch(error => {
        databaseErrorHandler(res, error);
      });
  } else {
    res
      .status(400)
      .send("Member id: " + req.params.id + " is not valid!")
      .end();
  }

});

/** http://localhost:PORT/api/member/:id    with method=DELETE **/
member.delete("/:id", function (req, res) {
  let id = Number(req.params.id);
  if (id && !isNaN(id) && id > 0) {
    knex
      .delete()
      .from("Member")
      .where("id", id)
      .then(data => {
        if (data === 1) {
          successHandler(res, data)
        } else {
          requestErrorHandler(res, "Invalid member id: " + id);
        }
      })
      .catch(error => {
        databaseErrorHandler(res, error);
      });
    } else {
      requestErrorHandler(res, "Member id: " + id + " is not valid!");
    }
});

//UPDATE member
/** http://localhost:PORT/api/member/    with method=PUT **/

member.put("/", function (req, res) {
  if (req.body.firstName && req.body.lastName && req.body.email) {
    knex("Member")
      .where("id", req.body.id)
      .update(req.body)
      .then(data => {
        if (data === 1) {
          successHandler(res, data, "Success! Rows modified:" + data)
        } else {
          res
            requestErrorHandler(res, "Update not successful, " + data + " row modified")
        }
      })
      .catch(error => {
        if (error.errno == 1062) {
          // https://mariadb.com/kb/en/library/mariadb-error-codes/
          requestErrorHandler(res, "Conflict: Member with that name already exists!");
        } else if (error.errno == 1054) {
          requestErrorHandler(res, "error in spelling [either in 'firstName' and/or in 'lastname' and or in 'email'].")
        } else {
          databaseErrorHandler(res, error);
        }
      });
  } else {
    res.status(400)
       .send({
        error: "first name and /or last name and/or email is missing."
      })
  }
});

//GET Idea & Comments by member id

member.get("/idea/comment/:id", (req, res) => {
  let id = req.params.id;
  knex.select('commentTimeStamp', 'commentText', 'Idea.name')
    .from('Comment')
    .join('Idea', function () {
      this.on('Idea.id', '=', 'Comment.ideaId')
    })
    .where('Comment.memberId', id)
    .then(data => {
      if (data.length == 0) {
        requestErrorHandler(res, req.params.id + " No comments");
      } else {
        successHandler(res, data)
      }
    })
    .catch(error => {
      databaseErrorHandler(res, error)
    });
});

export default member;

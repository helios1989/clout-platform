/**
 * Ico.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var enumScore = ["low", "medium", "hight"];

module.exports = {

  attributes: {
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    status: {
      type: "string",
      enum: ["upcoming", "running", "finished"]
    },
    startDate: {
      type: "date"
    },
    endDate: {
      type: "date"
    },
    image: {
      type: "string"
    },
    projectStage: {
      type: "string"
    },
    hypeScore: {
      type: "string",
      enum: enumScore
    },
    riskScore: {
      type: "string",
      enum: enumScore
    },
    investScore: {
      type: "string",
      enum: enumScore
    },
    categories: {
      collection: 'IcoCategory',
      via: 'id'
    },//need model
    founded: {
      type: "string"
    },
    site: {
      type: "string"
    },
    blog: {
      type: "string"
    },
    primaryGeography: {
      type: "string"
    },
    features: {
      type: "string"
    },
    similarProjects: {
      collection: 'Ico',
      via: 'id'
    },
    tokenType: {
      type: "string"
    },
    tokenTechnology: {
      type: "string"
    },
    amount: {
      type: "integer"
    },
    jurisdiction: {
      type: "string"
    },
    tokensDistribution: {
      type: "string"
    },
    tokenSales: {
      type: "string"
    },
    accepts: {
      collection: "Altcoin",
      via: 'id'
    }, //link to Altcoins
    technicalDetails: {
      type: "string"
    },
    sourceCode: {
      type: "string"
    },
    proofOfDeveloper: {
      type: "string"
    },
    team: {
      collection: "IcoTeam",
      via: 'id'
    },
    socials: {
      collection: "IcoSocial",
      via: 'id'
    }
  }
};

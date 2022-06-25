/**
 * Productos.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {    
    title: { type: 'string', required: true },
    description: { type: 'string', defaultsTo: 'no description available' },
    price: { type: 'number', required: true },
    image: { type: 'string', defaultsTo: 'Not available' },
    count: { type: 'number', required: true }
  },

};


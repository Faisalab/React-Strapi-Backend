'use strict';

const stripe = require('stripe')('MY_SECRET_KEY');

/**
 * Orders.js controller
 *
 * @description: A set of functions called "actions" for managing `Orders`.
 */

module.exports = {

  /**
   * Retrieve orders records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.orders.search(ctx.query);
    } else {
      return strapi.services.orders.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a orders record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.orders.fetch(ctx.params);
  },

  /**
   * Count orders records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.orders.count(ctx.query, populate);
  },

  /**
   * Create a/an orders record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const { name, address, city, products, amount, token } = ctx.request.body;

    // Stripe Charge
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
      description: `Order ${new Date(Date.now())} - Name: ${name}`,
      source: token
    })
    .catch(err => console.log(err))

    const order = await strapi.services.orders.add({
      address,
      city,
      products,
      amount,
    });

    return order;

  },

  /**
   * Update a/an orders record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.orders.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an orders record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.orders.remove(ctx.params);
  }
};

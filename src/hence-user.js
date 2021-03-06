'use strict';
/**
 * @module hence-user
 */

import Hence from 'hence-component-framework';
import API from './.mapi';

/**
 * HenceUser Component
 * @constructor
 */
let HenceUser = Hence.Schema({
  is: 'hence-user',
  /********************************************************************************************************************
   * Initialization
   ********************************************************************************************************************/
  properties: {},

  /*********************************************************************************************************************
   * Element Behaviour
   ********************************************************************************************************************/

  /**
   * Determine the action and query passed in to handle the request and provide whatever state data is required along.
   * Executed by the ```render()``` function
   *
   * @private
   */
    _executeQuery(done) {
    try {
      let {action, query} = this;

      switch (action) {
        case 'get':
          API.find(query, (err, entry) => {
            if (err) {
              // handle error
            }

            return done(err, entry);
          });

          break;
        case 'list':
          API.find((err, entries) => {
            if (err) {
              // handle error
            }

            return done(err, entries);
          });

          break;
      }
    } catch (e) {
      console.error(`${this.is}._executeQuery::failure`, e);
      done(e);
    }
  }
});

export default HenceUser;

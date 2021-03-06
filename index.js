/**
 * Copyright 2018, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START functions_start_instance_pubsub]
// [START functions_stop_instance_pubsub]
const Buffer = require('safe-buffer').Buffer;
const Compute = require('@google-cloud/compute');
const compute = new Compute();
// [END functions_stop_instance_pubsub]

/**
 * Starts a Compute Engine instance.
 *
 * Expects a PubSub message with JSON-formatted event data containing the
 * following attributes:
 *  zone - the GCP zone the instance is located in.
 *  instance - the name of the instance.
 *
 * @param {!object} event Cloud Function PubSub message event.
 * @param {!object} callback Cloud Function PubSub callback indicating completion.
 */
exports.startInstancePubSubMul = (event, callback) => {
  try {
    const pubsubMessage = event.data;
    const payload = _validatePayload(
      JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString())
    );

    console.log("zone: %s", payload.zone)
    console.log("payload: payload.instances.length")
    var i;
    for (i = 0; i < payload.instances.length; i++) {
      var instance = payload.instances[i]
      console.log(instance)

      compute
        .zone(payload.zone)
        .vm(instance)
        .start()
        .then(data => {
          // Operation pending.
          const operation = data[0];
          return operation.promise();
        })
        .then(() => {
          // Operation complete. Instance successfully started.
          const message = 'Successfully started instance ' + instance;
          console.log(message);
          callback(null, message);
        })
        .catch(err => {
          console.log(err);
          callback(err);
        });
    }
  } catch (err) {
    console.log(err);
    callback(err);
  }
};
// [END functions_start_instance_pubsub]
// [START functions_stop_instance_pubsub]

/**
 * Stops a Compute Engine instance.
 *
 * Expects a PubSub message with JSON-formatted event data containing the
 * following attributes:
 *  zone - the GCP zone the instance is located in.
 *  instance - the name of the instance.
 *
 * @param {!object} event Cloud Function PubSub message event.
 * @param {!object} callback Cloud Function PubSub callback indicating completion.
 */
exports.stopInstancePubSubMul = (event, callback) => {
  try {
    const pubsubMessage = event.data;
    const payload = _validatePayload(
      JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString())
    );

    console.log("zone: %s", payload.zone)
    console.log("payload: payload.instances.length")
    var i;
    for (i = 0; i < payload.instances.length; i++) {
      var instance = payload.instances[i]
      console.log(instance)

      compute
        .zone(payload.zone)
        .vm(instance)
        .stop()
        .then(data => {
          // Operation pending.
          const operation = data[0];
          return operation.promise();
        })
        .then(() => {
          // Operation complete. Instance successfully stopped.
          const message = 'Successfully stopped instance ' + instance;
          console.log(message);
          callback(null, message);
        })
        .catch(err => {
          console.log(err);
          callback(err);
        });
    }
  } catch (err) {
    console.log(err);
    callback(err);
  }
};
// [START functions_start_instance_pubsub]

/**
 * Validates that a request payload contains the expected fields.
 *
 * @param {!object} payload the request payload to validate.
 * @returns {!object} the payload object.
 */
function _validatePayload(payload) {
  if (!payload.zone) {
    throw new Error(`Attribute 'zone' missing from payload`);
  } else if (!payload.instances) {
    throw new Error(`Attribute 'instances' missing from payload`);
  }
  return payload;
}
// [END functions_start_instance_pubsub]
// [END functions_stop_instance_pubsub]

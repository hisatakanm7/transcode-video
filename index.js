'use strict';

var AWS = require('aws-sdk');

var elasticTranscoder = new AWS .ElasticTranscoder({
    region: 'us-east-1'
});

exports.handler = function(event, context, callback) {
    const record = event.Records[0];
    if (!record.hasOwnProperty('s3') || !record.s3.hasOwnProperty('object')) {
        console.log('received invalid parameter');
        return;
    }
    const key = record.s3.object.key;

    const sourceKey = decodeURIComponent(key.replace(/\+/g, " "));

    const outputKey = sourceKey.split('.')[0]

    console.log('key:', key, sourceKey, outputKey);

    const params = {
        PipelineId: '1523456019099-z6khd9',
        OutputKeyPrefix: outputKey + '/',
        Input: {
            Key: sourceKey
        },
        Outputs: [
            {
                Key: outputKey + '-1080p' + '.mp4',
                PresetId: '1351620000001-000001'
            },
            {
                Key: outputKey + '-720p' + '.mp4',
                PresetId: '1351620000001-000010'
            },
            {
                Key: outputKey + '-web-720p' + '.mp4',
                PresetId: '1351620000001-100070'
            }
        ]
    };
    elasticTranscoder.createJob(params, function(error, data) {
        if (error) {
            callback(error);
        };
    });
};
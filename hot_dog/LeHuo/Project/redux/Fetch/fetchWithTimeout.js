/**
 * Created by zhangyu on 2017/11/20.
 */
let DEFAULT_TIMEOUT = 60000;
function fetchWithTimeout(uri, header,body):Promise {
    var _fetchTimeout = header&&header.timeout? header.timeout : DEFAULT_TIMEOUT;
    return new Promise(function (resolve, reject) {
        let isRequestAlive = true;
        let request = fetch(uri, header);
        let requestTimeout = setTimeout(function () {
            isRequestAlive=false;
            reject(new Error('fetchWithTimeout(): timeout' ));
        }, _fetchTimeout);
        request.then(function (response) {
            clearTimeout(requestTimeout);
            // debugger;
            if (isRequestAlive) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response);
                }
                else {
                    console.log()
                    var error = new Error('fetchWithTimeout(): Still no successful response ');
                    error.response = response;
                    reject(response);
                }
            }
        })['catch'](function (error) {
            clearTimeout(requestTimeout);
            if (isRequestAlive) {
                reject(error);
            }
        });
    });
}
module.exports = fetchWithTimeout;
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

function convertPath(url) {
    return decodeURI(url).substring(11).replace(/\/$/, '');
}

module.exports = {

    createEntry: function (entry) {
        var cordovaEntry;
        if (entry.isFile) {
            cordovaEntry = new window.FileEntry(entry.name, convertPath(entry.toURL()));
        } else {
            cordovaEntry = new window.DirectoryEntry(entry.name, convertPath(entry.toURL()));
        }
        cordovaEntry.nativeEntry = entry;
        return cordovaEntry;
    },

    getEntryForURI: function (uri, success, fail) {
        //TODO: account for local vs file system
        window.resolveLocalFileSystemURI(uri, success, fail);
    },

    getFileSystemName: function (fs) {
        return (fs.name.indexOf('Persistent') != -1) ? 'persistent' : 'temporary';
    }
};

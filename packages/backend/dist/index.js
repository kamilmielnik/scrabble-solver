/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "9f19c88d9ea51669e7de";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../scrabble-solver-commons/constants/index.js":
/*!*****************************************************!*\
  !*** ../scrabble-solver-commons/constants/index.js ***!
  \*****************************************************/
/*! exports provided: API_HOST, API_PORT, API_URL, EMPTY_CELL, BLANK, BONUS_CHARACTER, BONUS_WORD */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"API_HOST\", function() { return API_HOST; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"API_PORT\", function() { return API_PORT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"API_URL\", function() { return API_URL; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EMPTY_CELL\", function() { return EMPTY_CELL; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BLANK\", function() { return BLANK; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BONUS_CHARACTER\", function() { return BONUS_CHARACTER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BONUS_WORD\", function() { return BONUS_WORD; });\nvar API_HOST = undefined || 'http://localhost';\nvar API_PORT = Number(undefined) || 5000;\nvar API_URL = \"\".concat(API_HOST, \":\").concat(API_PORT, \"/api\");\nvar EMPTY_CELL = ' ';\nvar BLANK = ' ';\nvar BONUS_CHARACTER = 'BONUS_CHARACTER';\nvar BONUS_WORD = 'BONUS_WORD';\n\n//# sourceURL=webpack:///../scrabble-solver-commons/constants/index.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/board.js":
/*!**************************************************!*\
  !*** ../scrabble-solver-commons/models/board.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"../scrabble-solver-commons/constants/index.js\");\n/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cell */ \"../scrabble-solver-commons/models/cell.js\");\n/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tile */ \"../scrabble-solver-commons/models/tile.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\nvar Board =\n/*#__PURE__*/\nfunction () {\n  function Board(_ref) {\n    var board = _ref.board;\n\n    _classCallCheck(this, Board);\n\n    this.board = board;\n    this.numberOfRows = board.length;\n    this.numberOfColumns = board[0].length;\n  }\n\n  _createClass(Board, [{\n    key: \"isEmpty\",\n    value: function isEmpty() {\n      return this.board.every(function (row) {\n        return row.every(function (_ref2) {\n          var isEmpty = _ref2.isEmpty;\n          return isEmpty;\n        });\n      });\n    }\n  }, {\n    key: \"getRow\",\n    value: function getRow(index) {\n      return this.board[index];\n    }\n  }, {\n    key: \"getColumn\",\n    value: function getColumn(index) {\n      return this.board.map(function (row) {\n        return row[index];\n      });\n    }\n  }, {\n    key: \"collides\",\n    value: function collides(cell) {\n      return this.collidesUp(cell) || this.collidesDown(cell) || this.collidesLeft(cell) || this.collidesRight(cell);\n    }\n  }, {\n    key: \"collidesUp\",\n    value: function collidesUp(_ref3) {\n      var x = _ref3.x,\n          y = _ref3.y;\n      return y > 0 && !this.board[y - 1][x].isEmpty;\n    }\n  }, {\n    key: \"collidesDown\",\n    value: function collidesDown(_ref4) {\n      var x = _ref4.x,\n          y = _ref4.y;\n      return y < this.numberOfRows - 1 && !this.board[y + 1][x].isEmpty;\n    }\n  }, {\n    key: \"collidesLeft\",\n    value: function collidesLeft(_ref5) {\n      var x = _ref5.x,\n          y = _ref5.y;\n      return x > 0 && !this.board[y][x - 1].isEmpty;\n    }\n  }, {\n    key: \"collidesRight\",\n    value: function collidesRight(_ref6) {\n      var x = _ref6.x,\n          y = _ref6.y;\n      return x < this.numberOfColumns - 1 && !this.board[y][x + 1].isEmpty;\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return '';\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return this.board.map(function (row) {\n        return row.map(function (cell) {\n          return cell.toJson();\n        });\n      });\n    }\n  }], [{\n    key: \"fromJson\",\n    value: function fromJson(json) {\n      return new Board({\n        board: json.map(function (row) {\n          return row.map(_cell__WEBPACK_IMPORTED_MODULE_1__[\"default\"].fromJson);\n        })\n      });\n    }\n  }, {\n    key: \"fromStringArray\",\n    value: function fromStringArray(stringArray) {\n      return new Board({\n        board: stringArray.map(function (row, y) {\n          return row.split('').map(function (character, x) {\n            return new _cell__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n              x: x,\n              y: y,\n              isEmpty: !character || character === _constants__WEBPACK_IMPORTED_MODULE_0__[\"EMPTY_CELL\"],\n              tile: character === _constants__WEBPACK_IMPORTED_MODULE_0__[\"EMPTY_CELL\"] ? _tile__WEBPACK_IMPORTED_MODULE_2__[\"NullTile\"] : new _tile__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n                character: character\n              })\n            });\n          });\n        })\n      });\n    }\n  }]);\n\n  return Board;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Board);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/board.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/bonus-factory.js":
/*!**********************************************************!*\
  !*** ../scrabble-solver-commons/models/bonus-factory.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"../scrabble-solver-commons/constants/index.js\");\n/* harmony import */ var _character_bonus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./character-bonus */ \"../scrabble-solver-commons/models/character-bonus.js\");\n/* harmony import */ var _word_bonus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./word-bonus */ \"../scrabble-solver-commons/models/word-bonus.js\");\nvar _Constructors;\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }\n\nfunction _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\nvar Constructors = (_Constructors = {}, _defineProperty(_Constructors, _constants__WEBPACK_IMPORTED_MODULE_0__[\"BONUS_CHARACTER\"], _character_bonus__WEBPACK_IMPORTED_MODULE_1__[\"default\"]), _defineProperty(_Constructors, _constants__WEBPACK_IMPORTED_MODULE_0__[\"BONUS_WORD\"], _word_bonus__WEBPACK_IMPORTED_MODULE_2__[\"default\"]), _Constructors);\n\nvar BonusFactory =\n/*#__PURE__*/\nfunction () {\n  function BonusFactory(config) {\n    _classCallCheck(this, BonusFactory);\n\n    this.config = config;\n  }\n\n  _createClass(BonusFactory, [{\n    key: \"create\",\n    value: function create(_ref) {\n      var type = _ref.type,\n          params = _objectWithoutProperties(_ref, [\"type\"]);\n\n      var Bonus = Constructors[type];\n      return new Bonus(_objectSpread({\n        config: this.config\n      }, params));\n    }\n  }]);\n\n  return BonusFactory;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (BonusFactory);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/bonus-factory.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/bonus.js":
/*!**************************************************!*\
  !*** ../scrabble-solver-commons/models/bonus.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Bonus =\n/*#__PURE__*/\nfunction () {\n  function Bonus(_ref) {\n    var config = _ref.config,\n        x = _ref.x,\n        y = _ref.y,\n        multiplier = _ref.multiplier,\n        score = _ref.score;\n\n    _classCallCheck(this, Bonus);\n\n    this.config = config;\n    this.x = x;\n    this.y = y;\n    this.multiplier = multiplier;\n    this.score = score;\n  }\n\n  _createClass(Bonus, [{\n    key: \"canApply\",\n    value: function canApply(cell) {\n      return this.matchesCellCoordinates(cell);\n    }\n  }, {\n    key: \"matchesCellCoordinates\",\n    value: function matchesCellCoordinates(cell) {\n      return this.x === cell.x && this.y === cell.y;\n    }\n  }, {\n    key: \"getValue\",\n    value: function getValue() {\n      return {\n        wordMultiplier: 1,\n        characterMultiplier: 1\n      };\n    }\n  }, {\n    key: \"getType\",\n    value: function getType() {\n      throw new Error('Bonus was instantiated without a \"type\"');\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        x: this.x,\n        y: this.y,\n        multiplier: this.multiplier,\n        score: this.score,\n        type: this.getType()\n      };\n    }\n  }]);\n\n  return Bonus;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Bonus);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/bonus.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/cell.js":
/*!*************************************************!*\
  !*** ../scrabble-solver-commons/models/cell.js ***!
  \*************************************************/
/*! exports provided: NullCell, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NullCell\", function() { return NullCell; });\n/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tile */ \"../scrabble-solver-commons/models/tile.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Cell =\n/*#__PURE__*/\nfunction () {\n  function Cell(_ref) {\n    var x = _ref.x,\n        y = _ref.y,\n        _ref$tile = _ref.tile,\n        tile = _ref$tile === void 0 ? _tile__WEBPACK_IMPORTED_MODULE_0__[\"NullTile\"] : _ref$tile,\n        _ref$isEmpty = _ref.isEmpty,\n        isEmpty = _ref$isEmpty === void 0 ? true : _ref$isEmpty;\n\n    _classCallCheck(this, Cell);\n\n    this.x = x;\n    this.y = y;\n    this.tile = tile;\n    this.isEmpty = isEmpty;\n  }\n\n  _createClass(Cell, [{\n    key: \"hasTile\",\n    value: function hasTile() {\n      return this.tile !== _tile__WEBPACK_IMPORTED_MODULE_0__[\"NullTile\"];\n    }\n  }, {\n    key: \"isCandidate\",\n    value: function isCandidate() {\n      return this.isEmpty && this.hasTile();\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return String(this.tile);\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        x: this.x,\n        y: this.y,\n        tile: this.tile.toJson(),\n        isEmpty: this.isEmpty\n      };\n    }\n  }, {\n    key: \"clone\",\n    value: function clone() {\n      return new this.constructor({\n        x: this.x,\n        y: this.y,\n        tile: this.tile.clone(),\n        isEmpty: this.isEmpty\n      });\n    }\n  }], [{\n    key: \"fromJson\",\n    value: function fromJson(json) {\n      if (!json) {\n        return NullCell;\n      }\n\n      return new Cell({\n        x: json.x,\n        y: json.y,\n        tile: _tile__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fromJson(json.tile),\n        isEmpty: json.isEmpty\n      });\n    }\n  }]);\n\n  return Cell;\n}();\n\nvar NullCell = Object.freeze({\n  hasTile: function hasTile() {\n    return false;\n  },\n  toString: function toString() {\n    return '';\n  },\n  toJson: function toJson() {\n    return null;\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (Cell);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/cell.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/character-bonus.js":
/*!************************************************************!*\
  !*** ../scrabble-solver-commons/models/character-bonus.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"../scrabble-solver-commons/constants/index.js\");\n/* harmony import */ var _bonus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bonus */ \"../scrabble-solver-commons/models/bonus.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\nvar CharacterBonus =\n/*#__PURE__*/\nfunction (_Bonus) {\n  _inherits(CharacterBonus, _Bonus);\n\n  function CharacterBonus() {\n    _classCallCheck(this, CharacterBonus);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(CharacterBonus).apply(this, arguments));\n  }\n\n  _createClass(CharacterBonus, [{\n    key: \"canApply\",\n    value: function canApply(cell) {\n      return this.matchesCellCoordinates(cell) && this.matchesCellTileScore(cell);\n    }\n  }, {\n    key: \"matchesCellTileScore\",\n    value: function matchesCellTileScore(cell) {\n      var character = cell.tile.character;\n      var cellTileScore = this.config.pointsMap[character];\n      return this.score && this.score === cellTileScore;\n    }\n  }, {\n    key: \"getType\",\n    value: function getType() {\n      return _constants__WEBPACK_IMPORTED_MODULE_0__[\"BONUS_CHARACTER\"];\n    }\n  }, {\n    key: \"getValue\",\n    value: function getValue() {\n      return {\n        wordMultiplier: 1,\n        characterMultiplier: this.multiplier\n      };\n    }\n  }]);\n\n  return CharacterBonus;\n}(_bonus__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (CharacterBonus);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/character-bonus.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/config.js":
/*!***************************************************!*\
  !*** ../scrabble-solver-commons/models/config.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"../scrabble-solver-commons/constants/index.js\");\n/* harmony import */ var _bonus_factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bonus-factory */ \"../scrabble-solver-commons/models/bonus-factory.js\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar NO_BONUS = {\n  wordMultiplier: 1,\n  characterMultiplier: 1\n};\n\nvar Config =\n/*#__PURE__*/\nfunction () {\n  function Config(config) {\n    _classCallCheck(this, Config);\n\n    var bonusFactory = new _bonus_factory__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this);\n    this.id = config.id;\n    this.name = config.name;\n    this.boardWidth = config.boardWidth;\n    this.boardHeight = config.boardHeight;\n    this.maximumNumberOfCharacters = config.maximumNumberOfCharacters;\n    this.minimumWordLength = config.minimumWordLength;\n    this.maximumWordLength = config.maximumWordLength;\n    this.blankScore = config.blankScore;\n    this.allTilesBonusScore = config.allTilesBonusScore;\n    this.numberOfBlanks = config.numberOfBlanks;\n    this.characters = config.characters;\n    this.bonuses = getBonuses(bonusFactory, config);\n    this.alphabet = getAlphabet(config);\n    this.allCharacters = getAllCharacters(config);\n    this.pointsMap = getPointsMap(config);\n  }\n\n  _createClass(Config, [{\n    key: \"getCellBonusValue\",\n    value: function getCellBonusValue(cell) {\n      if (!cell.isEmpty) {\n        return NO_BONUS;\n      }\n\n      var cellBonus = this.bonuses.find(function (bonus) {\n        return bonus.canApply(cell);\n      });\n\n      if (!cellBonus) {\n        return NO_BONUS;\n      }\n\n      return cellBonus.getValue();\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        id: this.id,\n        name: this.name,\n        blankScore: this.blankScore,\n        boardWidth: this.boardWidth,\n        boardHeight: this.boardHeight,\n        maximumNumberOfCharacters: this.maximumNumberOfCharacters,\n        minimumWordLength: this.minimumWordLength,\n        maximumWordLength: this.maximumWordLength,\n        characters: this.characters,\n        numberOfBlanks: this.numberOfBlanks,\n        allTilesBonusScore: this.allTilesBonusScore,\n        bonuses: this.bonuses.map(function (bonus) {\n          return bonus.toJson();\n        })\n      };\n    }\n  }], [{\n    key: \"fromJson\",\n    value: function fromJson(json) {\n      return new Config(json);\n    }\n  }]);\n\n  return Config;\n}();\n\nvar getAlphabet = function getAlphabet(_ref) {\n  var characters = _ref.characters;\n  return characters.map(function (_ref2) {\n    var character = _ref2.character;\n    return character;\n  });\n};\n\nvar getAllCharacters = function getAllCharacters(_ref3) {\n  var characters = _ref3.characters,\n      numberOfBlanks = _ref3.numberOfBlanks;\n  return characters.reduce(function (allCharacters, _ref4) {\n    var character = _ref4.character,\n        count = _ref4.count;\n    return allCharacters + Array(count).fill(character).join('');\n  }, Array(numberOfBlanks).fill(_constants__WEBPACK_IMPORTED_MODULE_0__[\"BLANK\"]).join(''));\n};\n\nvar getPointsMap = function getPointsMap(_ref5) {\n  var characters = _ref5.characters;\n  return characters.reduce(function (pointsMap, _ref6) {\n    var character = _ref6.character,\n        score = _ref6.score;\n    return _objectSpread({}, pointsMap, _defineProperty({}, character, score));\n  }, {});\n};\n\nvar getBonuses = function getBonuses(bonusFactory, _ref7) {\n  var bonuses = _ref7.bonuses;\n  return bonuses.map(function (bonus) {\n    return bonusFactory.create(bonus);\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Config);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/config.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/horizontal-pattern.js":
/*!***************************************************************!*\
  !*** ../scrabble-solver-commons/models/horizontal-pattern.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pattern__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pattern */ \"../scrabble-solver-commons/models/pattern.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\nvar HorizontalPattern =\n/*#__PURE__*/\nfunction (_Pattern) {\n  _inherits(HorizontalPattern, _Pattern);\n\n  function HorizontalPattern() {\n    _classCallCheck(this, HorizontalPattern);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(HorizontalPattern).apply(this, arguments));\n  }\n\n  _createClass(HorizontalPattern, [{\n    key: \"getCollisions\",\n    value: function getCollisions() {\n      var _this = this;\n\n      var collisions = [];\n      this.cells.filter(function (cell) {\n        return cell.isEmpty && (_this.board.collidesUp(cell) || _this.board.collidesDown(cell));\n      }).forEach(function (cell) {\n        var column = _this.board.getColumn(cell.x);\n\n        var y = cell.y - 1;\n\n        while (y >= 0 && column[y].hasTile()) {\n          --y;\n        }\n\n        var previousCells = column.slice(y + 1, cell.y);\n        y = cell.y + 1;\n\n        while (y < column.length && column[y].hasTile()) {\n          ++y;\n        }\n\n        var nextCells = column.slice(cell.y + 1, y);\n        var cells = [].concat(_toConsumableArray(previousCells), [cell], _toConsumableArray(nextCells));\n\n        if (cells.length > 1) {\n          var pattern = new _pattern__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n            board: _this.board,\n            cells: cells\n          }).clone();\n          collisions.push(pattern);\n        }\n      });\n      return collisions;\n    }\n  }]);\n\n  return HorizontalPattern;\n}(_pattern__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (HorizontalPattern);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/horizontal-pattern.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/index.js":
/*!**************************************************!*\
  !*** ../scrabble-solver-commons/models/index.js ***!
  \**************************************************/
/*! exports provided: Board, Cell, Config, HorizontalPattern, Pattern, Result, Tile, VerticalPattern, WordDefinition, NullWordDefinition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ \"../scrabble-solver-commons/models/board.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Board\", function() { return _board__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cell */ \"../scrabble-solver-commons/models/cell.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Cell\", function() { return _cell__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ \"../scrabble-solver-commons/models/config.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Config\", function() { return _config__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n/* harmony import */ var _horizontal_pattern__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./horizontal-pattern */ \"../scrabble-solver-commons/models/horizontal-pattern.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"HorizontalPattern\", function() { return _horizontal_pattern__WEBPACK_IMPORTED_MODULE_3__[\"default\"]; });\n\n/* harmony import */ var _pattern__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pattern */ \"../scrabble-solver-commons/models/pattern.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Pattern\", function() { return _pattern__WEBPACK_IMPORTED_MODULE_4__[\"default\"]; });\n\n/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./result */ \"../scrabble-solver-commons/models/result.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Result\", function() { return _result__WEBPACK_IMPORTED_MODULE_5__[\"default\"]; });\n\n/* harmony import */ var _tile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tile */ \"../scrabble-solver-commons/models/tile.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Tile\", function() { return _tile__WEBPACK_IMPORTED_MODULE_6__[\"default\"]; });\n\n/* harmony import */ var _vertical_pattern__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vertical-pattern */ \"../scrabble-solver-commons/models/vertical-pattern.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"VerticalPattern\", function() { return _vertical_pattern__WEBPACK_IMPORTED_MODULE_7__[\"default\"]; });\n\n/* harmony import */ var _word_definition__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./word-definition */ \"../scrabble-solver-commons/models/word-definition.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"WordDefinition\", function() { return _word_definition__WEBPACK_IMPORTED_MODULE_8__[\"default\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"NullWordDefinition\", function() { return _word_definition__WEBPACK_IMPORTED_MODULE_8__[\"NullWordDefinition\"]; });\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/index.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/pattern.js":
/*!****************************************************!*\
  !*** ../scrabble-solver-commons/models/pattern.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Pattern =\n/*#__PURE__*/\nfunction () {\n  function Pattern(_ref) {\n    var board = _ref.board,\n        cells = _ref.cells;\n\n    _classCallCheck(this, Pattern);\n\n    this.board = board;\n    this.cells = cells;\n  }\n\n  _createClass(Pattern, [{\n    key: \"getNumberOfEmptyCells\",\n    value: function getNumberOfEmptyCells() {\n      return this.cells.filter(function (cell) {\n        return cell.isEmpty;\n      }).length;\n    }\n  }, {\n    key: \"getIndexOfFirstCellWithoutTile\",\n    value: function getIndexOfFirstCellWithoutTile() {\n      return this.cells.findIndex(function (cell) {\n        return !cell.hasTile();\n      });\n    }\n  }, {\n    key: \"hasAtLeast1EmptyCell\",\n    value: function hasAtLeast1EmptyCell() {\n      return Boolean(this.cells.find(function (cell) {\n        return cell.isEmpty;\n      }));\n    }\n  }, {\n    key: \"hasAtLeast1NonEmptyCell\",\n    value: function hasAtLeast1NonEmptyCell() {\n      return Boolean(this.cells.find(function (cell) {\n        return !cell.isEmpty;\n      }));\n    }\n  }, {\n    key: \"collides\",\n    value: function collides() {\n      var _this = this;\n\n      return Boolean(this.cells.find(function (cell) {\n        return cell.isEmpty && _this.board.collides(cell);\n      }));\n    }\n  }, {\n    key: \"goesThroughBoardCenter\",\n    value: function goesThroughBoardCenter() {\n      var x = Math.floor(this.board.numberOfColumns / 2);\n      var y = Math.floor(this.board.numberOfRows / 2);\n      return this.cells.find(function (cell) {\n        return cell.x === x && cell.y === y && cell.isEmpty;\n      });\n    }\n  }, {\n    key: \"canBePlaced\",\n    value: function canBePlaced() {\n      var numberOfEmptyCells = this.getNumberOfEmptyCells();\n      var isNumberOfUsedCellsInRange = numberOfEmptyCells >= 1 && numberOfEmptyCells <= 7;\n      return isNumberOfUsedCellsInRange && (this.hasAtLeast1NonEmptyCell() || this.collides() || this.goesThroughBoardCenter() && this.board.isEmpty());\n    }\n  }, {\n    key: \"getCollisions\",\n    value: function getCollisions() {\n      return [];\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        cells: this.cells.map(function (cell) {\n          return cell.toJson();\n        }),\n        collisions: this.getCollisions().map(function (collision) {\n          return collision.toJson();\n        }),\n        word: this.toString()\n      };\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return this.cells.map(String).join('');\n    }\n  }, {\n    key: \"clone\",\n    value: function clone() {\n      return new this.constructor({\n        board: this.board,\n        cells: this.cells.map(function (cell) {\n          return cell.clone();\n        })\n      });\n    }\n  }]);\n\n  return Pattern;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Pattern);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/pattern.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/result.js":
/*!***************************************************!*\
  !*** ../scrabble-solver-commons/models/result.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cell */ \"../scrabble-solver-commons/models/cell.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Result =\n/*#__PURE__*/\nfunction () {\n  function Result(_ref) {\n    var id = _ref.id,\n        points = _ref.points,\n        cells = _ref.cells,\n        numberOfCollisions = _ref.numberOfCollisions;\n\n    _classCallCheck(this, Result);\n\n    var tiles = getTiles(cells);\n    this.id = id;\n    this.points = points;\n    this.cells = cells;\n    this.numberOfCollisions = numberOfCollisions;\n    this.word = getWord(cells);\n    this.length = cells.length;\n    this.tiles = tiles;\n    this.tilesCharacters = getTilesCharacters(tiles);\n    this.numberOfTiles = tiles.length;\n    this.numberOfBlanks = getBlanks(tiles).length;\n    this.pointsRatio = getPointsRatio(tiles, points);\n  }\n\n  _createClass(Result, [{\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        id: this.id,\n        points: this.points,\n        cells: this.cells.map(function (cell) {\n          return cell.toJson();\n        }),\n        numberOfCollisions: this.numberOfCollisions\n      };\n    }\n  }], [{\n    key: \"fromJson\",\n    value: function fromJson(json) {\n      return new Result({\n        id: json.id,\n        points: json.points,\n        cells: json.cells.map(_cell__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fromJson),\n        numberOfCollisions: json.numberOfCollisions\n      });\n    }\n  }]);\n\n  return Result;\n}();\n\nvar getTiles = function getTiles(cells) {\n  return cells.filter(function (_ref2) {\n    var isEmpty = _ref2.isEmpty;\n    return isEmpty;\n  }).map(function (_ref3) {\n    var tile = _ref3.tile;\n    return tile;\n  });\n};\n\nvar getWord = function getWord(cells) {\n  return cells.map(String).join('');\n};\n\nvar getBlanks = function getBlanks(tiles) {\n  return tiles.filter(function (_ref4) {\n    var isBlank = _ref4.isBlank;\n    return isBlank;\n  });\n};\n\nvar getTilesCharacters = function getTilesCharacters(tiles) {\n  return getNonBlankCharacters(tiles).sort(charactersComparator).join('');\n};\n\nvar getNonBlankCharacters = function getNonBlankCharacters(tiles) {\n  return getNonBlanks(tiles).map(function (_ref5) {\n    var character = _ref5.character;\n    return character;\n  });\n};\n\nvar getNonBlanks = function getNonBlanks(tiles) {\n  return tiles.filter(function (_ref6) {\n    var isBlank = _ref6.isBlank;\n    return !isBlank;\n  });\n};\n\nvar getPointsRatio = function getPointsRatio(tiles, points) {\n  return points / tiles.length;\n};\n\nvar charactersComparator = function charactersComparator(a, b) {\n  return a.localeCompare(b);\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Result);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/result.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/tile.js":
/*!*************************************************!*\
  !*** ../scrabble-solver-commons/models/tile.js ***!
  \*************************************************/
/*! exports provided: NullTile, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NullTile\", function() { return NullTile; });\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"../scrabble-solver-commons/constants/index.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Tile =\n/*#__PURE__*/\nfunction () {\n  function Tile(_ref) {\n    var character = _ref.character,\n        _ref$isBlank = _ref.isBlank,\n        isBlank = _ref$isBlank === void 0 ? false : _ref$isBlank;\n\n    _classCallCheck(this, Tile);\n\n    this.character = character;\n    this.isBlank = isBlank;\n  }\n\n  _createClass(Tile, [{\n    key: \"toString\",\n    value: function toString() {\n      return this.character;\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        character: this.character,\n        isBlank: this.isBlank\n      };\n    }\n  }, {\n    key: \"clone\",\n    value: function clone() {\n      return new this.constructor({\n        character: this.character,\n        isBlank: this.isBlank\n      });\n    }\n  }], [{\n    key: \"fromJson\",\n    value: function fromJson(json) {\n      if (!json) {\n        return NullTile;\n      }\n\n      return new Tile({\n        character: json.character,\n        isBlank: json.isBlank\n      });\n    }\n  }]);\n\n  return Tile;\n}();\n\nvar NullTile = Object.freeze({\n  character: _constants__WEBPACK_IMPORTED_MODULE_0__[\"EMPTY_CELL\"],\n  isBlank: false,\n  toString: function toString() {\n    return _constants__WEBPACK_IMPORTED_MODULE_0__[\"EMPTY_CELL\"];\n  },\n  toJson: function toJson() {\n    return null;\n  },\n  clone: function clone() {\n    return NullTile;\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (Tile);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/tile.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/vertical-pattern.js":
/*!*************************************************************!*\
  !*** ../scrabble-solver-commons/models/vertical-pattern.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pattern__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pattern */ \"../scrabble-solver-commons/models/pattern.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\nvar VerticalPattern =\n/*#__PURE__*/\nfunction (_Pattern) {\n  _inherits(VerticalPattern, _Pattern);\n\n  function VerticalPattern() {\n    _classCallCheck(this, VerticalPattern);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(VerticalPattern).apply(this, arguments));\n  }\n\n  _createClass(VerticalPattern, [{\n    key: \"getCollisions\",\n    value: function getCollisions() {\n      var _this = this;\n\n      var collisions = [];\n      this.cells.filter(function (cell) {\n        return cell.isEmpty && (_this.board.collidesLeft(cell) || _this.board.collidesRight(cell));\n      }).forEach(function (cell) {\n        var row = _this.board.getRow(cell.y);\n\n        var x = cell.x - 1;\n\n        while (x >= 0 && row[x].hasTile()) {\n          --x;\n        }\n\n        var previousCells = row.slice(x + 1, cell.x);\n        x = cell.x + 1;\n\n        while (x < row.length && row[x].hasTile()) {\n          ++x;\n        }\n\n        var nextCells = row.slice(cell.x + 1, x);\n        var cells = [].concat(_toConsumableArray(previousCells), [cell], _toConsumableArray(nextCells));\n\n        if (cells.length > 1) {\n          var pattern = new _pattern__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n            board: _this.board,\n            cells: cells\n          }).clone();\n          collisions.push(pattern);\n        }\n      });\n      return collisions;\n    }\n  }]);\n\n  return VerticalPattern;\n}(_pattern__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (VerticalPattern);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/vertical-pattern.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/word-bonus.js":
/*!*******************************************************!*\
  !*** ../scrabble-solver-commons/models/word-bonus.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"../scrabble-solver-commons/constants/index.js\");\n/* harmony import */ var _bonus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bonus */ \"../scrabble-solver-commons/models/bonus.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\nvar WordBonus =\n/*#__PURE__*/\nfunction (_Bonus) {\n  _inherits(WordBonus, _Bonus);\n\n  function WordBonus() {\n    _classCallCheck(this, WordBonus);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(WordBonus).apply(this, arguments));\n  }\n\n  _createClass(WordBonus, [{\n    key: \"getValue\",\n    value: function getValue() {\n      return {\n        wordMultiplier: this.multiplier,\n        characterMultiplier: 1\n      };\n    }\n  }, {\n    key: \"getType\",\n    value: function getType() {\n      return _constants__WEBPACK_IMPORTED_MODULE_0__[\"BONUS_WORD\"];\n    }\n  }]);\n\n  return WordBonus;\n}(_bonus__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (WordBonus);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/word-bonus.js?");

/***/ }),

/***/ "../scrabble-solver-commons/models/word-definition.js":
/*!************************************************************!*\
  !*** ../scrabble-solver-commons/models/word-definition.js ***!
  \************************************************************/
/*! exports provided: NullWordDefinition, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NullWordDefinition\", function() { return NullWordDefinition; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar WordDefinition =\n/*#__PURE__*/\nfunction () {\n  function WordDefinition(_ref) {\n    var definitions = _ref.definitions,\n        isAllowed = _ref.isAllowed,\n        word = _ref.word;\n\n    _classCallCheck(this, WordDefinition);\n\n    this.definitions = definitions;\n    this.isAllowed = isAllowed;\n    this.word = word;\n  }\n\n  _createClass(WordDefinition, [{\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        definitions: this.definitions,\n        isAllowed: this.isAllowed,\n        word: this.word\n      };\n    }\n  }]);\n\n  return WordDefinition;\n}();\n\nvar NullWordDefinition = Object.freeze({\n  definitions: [],\n  isAllowed: false,\n  word: ''\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (WordDefinition);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/word-definition.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\nmodule.exports.formatError = function(err) {\n\tvar message = err.message;\n\tvar stack = err.stack;\n\tif (!stack) {\n\t\treturn message;\n\t} else if (stack.indexOf(message) < 0) {\n\t\treturn message + \"\\n\" + stack;\n\t} else {\n\t\treturn stack;\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function(updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function(err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + log.formatError(err));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + log.formatError(err));\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?1000\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./src/endpoints/search-en-dictionary.js":
/*!***********************************************!*\
  !*** ./src/endpoints/search-en-dictionary.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\n\n\nvar API_KEY = 'd0c21cb3cbc3415984a2a0486da075e54aa68091c33a680d9';\nvar MAX_RESULTS = 10;\nvar SOURCE_DICTIONARIES = 'all';\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (request, response) {\n  return getJson(getOptions(request.params.word)).then(function (results) {\n    var wordDefinition = new scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"WordDefinition\"]({\n      definitions: results.map(function (_ref) {\n        var text = _ref.text;\n        return text;\n      }),\n      isAllowed: results.length > 0,\n      word: request.params.word\n    });\n    response.send(wordDefinition.toJson());\n  })[\"catch\"](function () {\n    return response.send(scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"NullWordDefinition\"]);\n  });\n});\n\nvar getOptions = function getOptions(word) {\n  return {\n    hostname: 'api.wordnik.com',\n    path: getWordnikUrl(word),\n    headers: {\n      'Content-Type': 'application/json; charset=utf-8'\n    }\n  };\n};\n\nvar getWordnikUrl = function getWordnikUrl(word) {\n  return [\"/v4/word.json/\".concat(word, \"/definitions?\"), [\"api_key=\".concat(API_KEY), \"limit=\".concat(MAX_RESULTS), \"sourceDictionaries=\".concat(SOURCE_DICTIONARIES)].join('&')].join('');\n};\n\nvar getJson = function getJson(options) {\n  return new Promise(function (resolve, reject) {\n    return http__WEBPACK_IMPORTED_MODULE_0___default.a.get(options, function (response) {\n      var data = '';\n      response.setEncoding('utf8');\n      response.on('data', function (chunk) {\n        data += chunk;\n      });\n      response.on('end', function () {\n        resolve(JSON.parse(data));\n      });\n    }).on('error', reject);\n  });\n};\n\n//# sourceURL=webpack:///./src/endpoints/search-en-dictionary.js?");

/***/ }),

/***/ "./src/endpoints/search-pl-dictionary.js":
/*!***********************************************!*\
  !*** ./src/endpoints/search-pl-dictionary.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express_http_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-http-proxy */ \"express-http-proxy\");\n/* harmony import */ var express_http_proxy__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_http_proxy__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cheerio */ \"cheerio\");\n/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cheerio__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\n\n\n\nvar DICTIONARY_URL = 'https://sjp.pl';\n/* harmony default export */ __webpack_exports__[\"default\"] = (express_http_proxy__WEBPACK_IMPORTED_MODULE_0___default()(DICTIONARY_URL, {\n  https: true,\n  userResDecorator: function userResDecorator(proxyResponse, proxyResponseData) {\n    return parseSjpResponse(proxyResponseData.toString('utf8'));\n  }\n}));\n\nvar parseSjpResponse = function parseSjpResponse(html) {\n  var $ = cheerio__WEBPACK_IMPORTED_MODULE_1___default.a.load(html);\n  var $header = $($('h1')[0]);\n  var $word = getWordNode($header);\n  var $isAllowed = getIsAllowedNode($header);\n  var $definitions = getDefinitionsNode($header);\n  var wordDefinition = new scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_2__[\"WordDefinition\"]({\n    definitions: getTrimmedDefinitions($definitions),\n    isAllowed: isAllowed($isAllowed),\n    word: getWord($word)\n  });\n  return wordDefinition.toJson();\n};\n\nvar getIsAllowedNode = function getIsAllowedNode($header) {\n  return $header.next();\n};\n\nvar getWordNode = function getWordNode($header) {\n  return $header.next().next();\n};\n\nvar getDefinitionsNode = function getDefinitionsNode($header) {\n  return $header.next().next().next().next();\n};\n\nvar getWord = function getWord($word) {\n  return $word.text().trim();\n};\n\nvar isAllowed = function isAllowed($isAllowed) {\n  return trim($isAllowed.text()).indexOf('dopuszczalne w grach') >= 0;\n};\n\nvar getTrimmedDefinitions = function getTrimmedDefinitions($definitions) {\n  return getDefinitions($definitions).map(trim).filter(Boolean);\n};\n\nvar getDefinitions = function getDefinitions($definitions) {\n  return $definitions.text().trim().split(/\\d+\\./);\n};\n\nvar trim = function trim(text) {\n  return text.trim();\n};\n\n//# sourceURL=webpack:///./src/endpoints/search-pl-dictionary.js?");

/***/ }),

/***/ "./src/endpoints/solve.js":
/*!********************************!*\
  !*** ./src/endpoints/solve.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\n/* harmony import */ var solver_trie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! solver/trie */ \"./src/solver/trie.js\");\n/* harmony import */ var solver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! solver */ \"./src/solver/index.js\");\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (filepath) {\n  var collection = createCollection(filepath);\n  return function (request, response) {\n    var _parseRequest = parseRequest(request),\n        board = _parseRequest.board,\n        config = _parseRequest.config,\n        tiles = _parseRequest.tiles;\n\n    var solver = new solver__WEBPACK_IMPORTED_MODULE_3__[\"default\"](config, collection);\n    var results = solver.solve(board, tiles);\n    response.send(results.map(function (result) {\n      return result.toJson();\n    }));\n  };\n});\n\nvar createCollection = function createCollection(filepath) {\n  var serialized = fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync(filepath, 'utf-8');\n  return solver_trie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].deserialize(serialized);\n};\n\nvar parseRequest = function parseRequest(_ref) {\n  var body = _ref.body;\n  return {\n    board: scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"Board\"].fromJson(body.board),\n    config: scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"Config\"].fromJson(body.config),\n    tiles: (body.tiles || []).map(scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"Tile\"].fromJson)\n  };\n};\n\n//# sourceURL=webpack:///./src/endpoints/solve.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var scrabble_solver_commons_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! scrabble-solver-commons/constants */ \"../scrabble-solver-commons/constants/index.js\");\n/* harmony import */ var endpoints_search_en_dictionary__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! endpoints/search-en-dictionary */ \"./src/endpoints/search-en-dictionary.js\");\n/* harmony import */ var endpoints_search_pl_dictionary__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! endpoints/search-pl-dictionary */ \"./src/endpoints/search-pl-dictionary.js\");\n/* harmony import */ var endpoints_solve__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! endpoints/solve */ \"./src/endpoints/solve.js\");\n\n\n\n\n\n\n\n\nvar dictionariesDirectory = process.argv[2] || '../dictionaries';\nvar locales = [{\n  locale: 'en-GB',\n  dictionaryEndpoint: endpoints_search_en_dictionary__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n  api: {\n    dictionary: '/api/en-GB/dictionary/:word',\n    solve: '/api/en-GB/solve'\n  }\n}, {\n  locale: 'en-US',\n  dictionaryEndpoint: endpoints_search_en_dictionary__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n  api: {\n    dictionary: '/api/en-US/dictionary/:word',\n    solve: '/api/en-US/solve'\n  }\n}, {\n  locale: 'pl-PL',\n  dictionaryEndpoint: endpoints_search_pl_dictionary__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n  api: {\n    dictionary: '/api/pl-PL/dictionary',\n    solve: '/api/pl-PL/solve'\n  }\n}];\nvar app = express__WEBPACK_IMPORTED_MODULE_1___default()();\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_3___default.a.urlencoded({\n  extended: false\n}));\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_3___default.a.json());\napp.use(cors__WEBPACK_IMPORTED_MODULE_2___default()());\nlocales.forEach(function (_ref) {\n  var api = _ref.api,\n      dictionaryEndpoint = _ref.dictionaryEndpoint,\n      locale = _ref.locale;\n  var dictionaryFilePath = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(dictionariesDirectory, \"\".concat(locale, \".txt\"));\n  var solveEndpoint = Object(endpoints_solve__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(dictionaryFilePath);\n  app.post(api.solve, solveEndpoint);\n  app.use(api.dictionary, dictionaryEndpoint);\n});\napp.listen(scrabble_solver_commons_constants__WEBPACK_IMPORTED_MODULE_4__[\"API_PORT\"], function () {\n  // eslint-disable-next-line no-console\n  console.log(\"Listening at \".concat(scrabble_solver_commons_constants__WEBPACK_IMPORTED_MODULE_4__[\"API_HOST\"], \":\").concat(scrabble_solver_commons_constants__WEBPACK_IMPORTED_MODULE_4__[\"API_PORT\"], \"/\"));\n});\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/solver/index.js":
/*!*****************************!*\
  !*** ./src/solver/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lodash_uniqBy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/uniqBy */ \"lodash/uniqBy\");\n/* harmony import */ var lodash_uniqBy__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_uniqBy__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\n/* harmony import */ var _patterns_filler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./patterns-filler */ \"./src/solver/patterns-filler.js\");\n/* harmony import */ var _patterns_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patterns-generator */ \"./src/solver/patterns-generator.js\");\n/* harmony import */ var _scores_calculator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scores-calculator */ \"./src/solver/scores-calculator.js\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\n\n\n\nvar Solver =\n/*#__PURE__*/\nfunction () {\n  function Solver(config, collection) {\n    _classCallCheck(this, Solver);\n\n    this.patternsFiller = new _patterns_filler__WEBPACK_IMPORTED_MODULE_2__[\"default\"](config, collection);\n    this.patternsGenerator = new _patterns_generator__WEBPACK_IMPORTED_MODULE_3__[\"default\"](config);\n    this.scoresCalculator = new _scores_calculator__WEBPACK_IMPORTED_MODULE_4__[\"default\"](config);\n  }\n\n  _createClass(Solver, [{\n    key: \"solve\",\n    value: function solve(board, tiles) {\n      var _this = this;\n\n      var _this$patternsGenerat = this.patternsGenerator.generate(board),\n          horizontal = _this$patternsGenerat.horizontal,\n          vertical = _this$patternsGenerat.vertical;\n\n      var patterns = [].concat(_toConsumableArray(horizontal), _toConsumableArray(vertical)).reduce(function (filledPatterns, pattern) {\n        return filledPatterns.concat(_this.patternsFiller.fill(pattern, tiles));\n      }, []);\n      var uniquePatterns = lodash_uniqBy__WEBPACK_IMPORTED_MODULE_0___default()(patterns, function (pattern) {\n        return JSON.stringify(pattern.toJson());\n      });\n      var results = uniquePatterns.map(function (pattern, index) {\n        return new scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"Result\"]({\n          id: index,\n          points: _this.scoresCalculator.calculate(pattern),\n          cells: pattern.cells,\n          numberOfCollisions: pattern.getCollisions().length\n        });\n      });\n      return results;\n    }\n  }]);\n\n  return Solver;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Solver);\n\n//# sourceURL=webpack:///./src/solver/index.js?");

/***/ }),

/***/ "./src/solver/patterns-filler.js":
/*!***************************************!*\
  !*** ./src/solver/patterns-filler.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar PatternsFiller =\n/*#__PURE__*/\nfunction () {\n  function PatternsFiller(config, collection) {\n    _classCallCheck(this, PatternsFiller);\n\n    this.config = config;\n    this.collection = collection;\n  }\n\n  _createClass(PatternsFiller, [{\n    key: \"fill\",\n    value: function fill(pattern, tiles) {\n      var _this = this;\n\n      var patterns = [];\n\n      if (pattern.getNumberOfEmptyCells() > tiles.length) {\n        return [];\n      }\n\n      var onPatternFound = function onPatternFound(newPattern) {\n        return patterns.push(newPattern);\n      };\n\n      this.generateBlankTilesPermutations(tiles).forEach(function (tilesPermutation) {\n        return _this.fillPattern(pattern, String(pattern), tilesPermutation, onPatternFound);\n      });\n      return patterns;\n    }\n  }, {\n    key: \"fillPattern\",\n    value: function fillPattern(pattern, word, tiles, onPatternFound) {\n      var indexOfFirstCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();\n\n      if (indexOfFirstCellWithoutTile === -1) {\n        if (this.canAddPattern(pattern, word)) {\n          onPatternFound(pattern.clone());\n        }\n      } else {\n        for (var index = 0; index < tiles.length; ++index) {\n          var tile = tiles[index];\n          var remainingTiles = tiles.slice(0, index).concat(tiles.slice(index + 1));\n          var previousTile = pattern.cells[indexOfFirstCellWithoutTile].tile;\n          pattern.cells[indexOfFirstCellWithoutTile].tile = tile;\n          var indexOfNextCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();\n          var newWordPrefix = word.substring(0, indexOfFirstCellWithoutTile) + tile.character;\n          var newWord = newWordPrefix + word.substring(indexOfFirstCellWithoutTile + 1);\n\n          if (indexOfNextCellWithoutTile === -1) {\n            if (this.canAddPattern(pattern, newWord)) {\n              onPatternFound(pattern.clone());\n            }\n          } else if (this.collection.hasMore(newWordPrefix)) {\n            this.fillPattern(pattern, newWord, remainingTiles, onPatternFound);\n          }\n\n          pattern.cells[indexOfFirstCellWithoutTile].tile = previousTile;\n        }\n      }\n    }\n  }, {\n    key: \"canAddPattern\",\n    value: function canAddPattern(pattern, word) {\n      var _this2 = this;\n\n      return this.collection.has(word) && pattern.getCollisions().map(String).every(function (collision) {\n        return _this2.collection.has(collision);\n      });\n    }\n  }, {\n    key: \"generateBlankTilesPermutations\",\n    value: function generateBlankTilesPermutations(tiles) {\n      var _this3 = this;\n\n      var alphabet = this.config.alphabet;\n      var firstBlankIndex = tiles.findIndex(function (_ref) {\n        var character = _ref.character,\n            isBlank = _ref.isBlank;\n        return isBlank && !alphabet.includes(character);\n      });\n\n      if (firstBlankIndex === -1) {\n        return [tiles];\n      }\n\n      var remainingTiles = tiles.slice(0, firstBlankIndex).concat(tiles.slice(firstBlankIndex + 1));\n      return this.config.alphabet.reduce(function (permutations, character) {\n        var newTile = new scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__[\"Tile\"]({\n          character: character,\n          isBlank: true\n        });\n        var newTiles = [].concat(_toConsumableArray(remainingTiles), [newTile]);\n        return permutations.concat(_this3.generateBlankTilesPermutations(newTiles));\n      }, []);\n    }\n  }]);\n\n  return PatternsFiller;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (PatternsFiller);\n\n//# sourceURL=webpack:///./src/solver/patterns-filler.js?");

/***/ }),

/***/ "./src/solver/patterns-generator.js":
/*!******************************************!*\
  !*** ./src/solver/patterns-generator.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar PatternsGenerator =\n/*#__PURE__*/\nfunction () {\n  function PatternsGenerator(config) {\n    _classCallCheck(this, PatternsGenerator);\n\n    this.config = config;\n  }\n\n  _createClass(PatternsGenerator, [{\n    key: \"generate\",\n    value: function generate(board) {\n      return {\n        horizontal: this.generatePatterns({\n          board: board,\n          Pattern: scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__[\"HorizontalPattern\"],\n          numberOfVectors: this.config.boardHeight,\n          getNthVector: function getNthVector(index) {\n            return board.getRow(index);\n          }\n        }),\n        vertical: this.generatePatterns({\n          board: board,\n          Pattern: scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__[\"VerticalPattern\"],\n          numberOfVectors: this.config.boardWidth,\n          getNthVector: function getNthVector(index) {\n            return board.getColumn(index);\n          }\n        })\n      };\n    }\n  }, {\n    key: \"generatePatterns\",\n    value: function generatePatterns(_ref) {\n      var _this = this;\n\n      var board = _ref.board,\n          Pattern = _ref.Pattern,\n          getNthVector = _ref.getNthVector,\n          numberOfVectors = _ref.numberOfVectors;\n      return this.generateVectors({\n        getNthVector: getNthVector,\n        numberOfVectors: numberOfVectors\n      }).reduce(function (patterns, cells) {\n        return patterns.concat(_this.generateCellsPatterns({\n          board: board,\n          Pattern: Pattern,\n          cells: cells\n        }));\n      }, []);\n    }\n  }, {\n    key: \"generateVectors\",\n    value: function generateVectors(_ref2) {\n      var getNthVector = _ref2.getNthVector,\n          numberOfVectors = _ref2.numberOfVectors;\n      return Array(numberOfVectors).fill(0).map(function (_, index) {\n        return getNthVector(index);\n      });\n    }\n  }, {\n    key: \"generateCellsPatterns\",\n    value: function generateCellsPatterns(_ref3) {\n      var _this2 = this;\n\n      var board = _ref3.board,\n          Pattern = _ref3.Pattern,\n          cells = _ref3.cells;\n      return this.generateStartIndices({\n        cells: cells\n      }).reduce(function (patterns, startIndex) {\n        return patterns.concat(_this2.generateEndIndices({\n          cells: cells,\n          startIndex: startIndex\n        }).reduce(function (placeablePatterns, endIndex) {\n          var pattern = new Pattern({\n            board: board,\n            cells: cells.slice(startIndex, endIndex + 1)\n          });\n\n          if (pattern.canBePlaced()) {\n            placeablePatterns.push(pattern);\n          }\n\n          return placeablePatterns;\n        }, []));\n      }, []);\n    }\n  }, {\n    key: \"generateStartIndices\",\n    value: function generateStartIndices(_ref4) {\n      var cells = _ref4.cells;\n      return Array(cells.length - 1).fill(0).map(function (_, startIndex) {\n        return startIndex;\n      }).filter(function (startIndex) {\n        return startIndex === 0 || !cells[startIndex - 1].hasTile();\n      });\n    }\n  }, {\n    key: \"generateEndIndices\",\n    value: function generateEndIndices(_ref5) {\n      var cells = _ref5.cells,\n          startIndex = _ref5.startIndex;\n      return Array(cells.length - startIndex - 1).fill(0).map(function (_, endIndex) {\n        return endIndex + startIndex + 1;\n      }).filter(function (endIndex) {\n        return endIndex >= cells.length - 1 || !cells[endIndex + 1].hasTile();\n      });\n    }\n  }]);\n\n  return PatternsGenerator;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (PatternsGenerator);\n\n//# sourceURL=webpack:///./src/solver/patterns-generator.js?");

/***/ }),

/***/ "./src/solver/scores-calculator.js":
/*!*****************************************!*\
  !*** ./src/solver/scores-calculator.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar ScoresCalculator =\n/*#__PURE__*/\nfunction () {\n  function ScoresCalculator(config) {\n    var _this = this;\n\n    _classCallCheck(this, ScoresCalculator);\n\n    _defineProperty(this, \"reduceCellScore\", function (_ref, cell) {\n      var multiplier = _ref.multiplier,\n          score = _ref.score;\n\n      var _this$config$getCellB = _this.config.getCellBonusValue(cell),\n          wordMultiplier = _this$config$getCellB.wordMultiplier,\n          characterMultiplier = _this$config$getCellB.characterMultiplier;\n\n      var characterScore = cell.tile.isBlank ? _this.config.blankScore : _this.config.pointsMap[cell.tile.character];\n      return {\n        multiplier: multiplier * wordMultiplier,\n        score: score + characterScore * characterMultiplier\n      };\n    });\n\n    this.config = config;\n  }\n\n  _createClass(ScoresCalculator, [{\n    key: \"calculate\",\n    value: function calculate(pattern) {\n      return this.calculatePatternScoreWithCollisions(pattern) + this.calculateBonusScore(pattern);\n    }\n  }, {\n    key: \"calculateBonusScore\",\n    value: function calculateBonusScore(pattern) {\n      var areAllTilesUsed = pattern.getNumberOfEmptyCells() === this.config.maximumNumberOfCharacters;\n      return areAllTilesUsed ? this.config.allTilesBonusScore : 0;\n    }\n  }, {\n    key: \"calculatePatternScoreWithCollisions\",\n    value: function calculatePatternScoreWithCollisions(pattern) {\n      var _this2 = this;\n\n      return pattern.getCollisions().reduce(function (patternsScore, collisionPattern) {\n        return patternsScore + _this2.calculatePatternScore(collisionPattern);\n      }, this.calculatePatternScore(pattern));\n    }\n  }, {\n    key: \"calculatePatternScore\",\n    value: function calculatePatternScore(pattern) {\n      var _pattern$cells$reduce = pattern.cells.reduce(this.reduceCellScore, {\n        multiplier: 1,\n        score: 0\n      }),\n          multiplier = _pattern$cells$reduce.multiplier,\n          score = _pattern$cells$reduce.score;\n\n      return score * multiplier;\n    }\n  }]);\n\n  return ScoresCalculator;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ScoresCalculator);\n\n//# sourceURL=webpack:///./src/solver/scores-calculator.js?");

/***/ }),

/***/ "./src/solver/trie-serializer.js":
/*!***************************************!*\
  !*** ./src/solver/trie-serializer.js ***!
  \***************************************/
/*! exports provided: serialize, deserialize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"serialize\", function() { return serialize; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deserialize\", function() { return deserialize; });\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar SEPARATOR = ',';\nvar OPEN_PARENS = '(';\nvar CLOSE_PARENS = ')';\nvar wordEndNode = {\n  wordEnd: true\n};\nvar serialize = function serialize(node) {\n  var character = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';\n  var letters = Object.keys(node).filter(function (key) {\n    return key.length === 1;\n  });\n  var hasMore = letters.length > 0;\n  var serialized = '';\n\n  if (node.wordEnd) {\n    serialized += character;\n  }\n\n  if (node.wordEnd && hasMore) {\n    serialized += SEPARATOR;\n  }\n\n  if (hasMore) {\n    serialized += character;\n    serialized += OPEN_PARENS;\n    serialized += letters.map(function (letter) {\n      return serialize(node[letter], letter);\n    }).join(SEPARATOR);\n    serialized += CLOSE_PARENS;\n  }\n\n  return serialized;\n};\nvar deserialize = function deserialize(serialized) {\n  var stack = [];\n  var node = {};\n  var i = 1;\n\n  while (i < serialized.length - 1) {\n    var character = serialized[i];\n    var nextCharacter = serialized[++i];\n\n    if (character === CLOSE_PARENS) {\n      node = stack.pop();\n    } else if (nextCharacter === SEPARATOR) {\n      node[character] = _objectSpread({}, wordEndNode);\n      ++i;\n    } else if (nextCharacter === CLOSE_PARENS) {\n      node[character] = _objectSpread({}, wordEndNode);\n      node = stack.pop();\n      ++i;\n    } else if (nextCharacter === OPEN_PARENS) {\n      stack.push(node);\n      var newNode = node[character] || {};\n      node[character] = newNode;\n      node = newNode;\n      ++i;\n    }\n  }\n\n  return node;\n};\n\n//# sourceURL=webpack:///./src/solver/trie-serializer.js?");

/***/ }),

/***/ "./src/solver/trie.js":
/*!****************************!*\
  !*** ./src/solver/trie.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _trie_serializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trie-serializer */ \"./src/solver/trie-serializer.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Trie =\n/*#__PURE__*/\nfunction () {\n  function Trie() {\n    var words = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n    _classCallCheck(this, Trie);\n\n    this.root = words.reduce(function (trie, word) {\n      var node = trie;\n      var _iteratorNormalCompletion = true;\n      var _didIteratorError = false;\n      var _iteratorError = undefined;\n\n      try {\n        for (var _iterator = word[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n          var character = _step.value;\n\n          if (!node[character]) {\n            node[character] = {};\n          }\n\n          node = node[character];\n        }\n      } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion && _iterator[\"return\"] != null) {\n            _iterator[\"return\"]();\n          }\n        } finally {\n          if (_didIteratorError) {\n            throw _iteratorError;\n          }\n        }\n      }\n\n      node.wordEnd = true;\n      return trie;\n    }, {});\n  }\n\n  _createClass(Trie, [{\n    key: \"has\",\n    value: function has(word) {\n      var node = this.root;\n      var _iteratorNormalCompletion2 = true;\n      var _didIteratorError2 = false;\n      var _iteratorError2 = undefined;\n\n      try {\n        for (var _iterator2 = word[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n          var character = _step2.value;\n\n          if (!node[character]) {\n            return false;\n          }\n\n          node = node[character];\n        }\n      } catch (err) {\n        _didIteratorError2 = true;\n        _iteratorError2 = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion2 && _iterator2[\"return\"] != null) {\n            _iterator2[\"return\"]();\n          }\n        } finally {\n          if (_didIteratorError2) {\n            throw _iteratorError2;\n          }\n        }\n      }\n\n      return node.wordEnd;\n    }\n  }, {\n    key: \"hasMore\",\n    value: function hasMore(word) {\n      var node = this.root;\n      var _iteratorNormalCompletion3 = true;\n      var _didIteratorError3 = false;\n      var _iteratorError3 = undefined;\n\n      try {\n        for (var _iterator3 = word[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {\n          var character = _step3.value;\n\n          if (!node[character]) {\n            return false;\n          }\n\n          node = node[character];\n        }\n      } catch (err) {\n        _didIteratorError3 = true;\n        _iteratorError3 = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion3 && _iterator3[\"return\"] != null) {\n            _iterator3[\"return\"]();\n          }\n        } finally {\n          if (_didIteratorError3) {\n            throw _iteratorError3;\n          }\n        }\n      }\n\n      return Object.keys(node).length > 0;\n    }\n  }, {\n    key: \"serialize\",\n    value: function serialize() {\n      return Object(_trie_serializer__WEBPACK_IMPORTED_MODULE_0__[\"serialize\"])(this.root);\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return this.root;\n    }\n  }], [{\n    key: \"deserialize\",\n    value: function deserialize(serialized) {\n      var trie = new Trie();\n      trie.root = Object(_trie_serializer__WEBPACK_IMPORTED_MODULE_0__[\"deserialize\"])(serialized);\n      return trie;\n    }\n  }, {\n    key: \"fromJson\",\n    value: function fromJson(json) {\n      var trie = new Trie();\n      trie.root = json;\n      return trie;\n    }\n  }]);\n\n  return Trie;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Trie);\n\n//# sourceURL=webpack:///./src/solver/trie.js?");

/***/ }),

/***/ 0:
/*!**************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?1000 */\"./node_modules/webpack/hot/poll.js?1000\");\nmodule.exports = __webpack_require__(/*! /home/kamil/projects/scrabble-solver/scrabble-solver-backend/src/index.js */\"./src/index.js\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cheerio":
/*!**************************!*\
  !*** external "cheerio" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cheerio\");\n\n//# sourceURL=webpack:///external_%22cheerio%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-http-proxy":
/*!*************************************!*\
  !*** external "express-http-proxy" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-http-proxy\");\n\n//# sourceURL=webpack:///external_%22express-http-proxy%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "lodash/uniqBy":
/*!********************************!*\
  !*** external "lodash/uniqBy" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/uniqBy\");\n\n//# sourceURL=webpack:///external_%22lodash/uniqBy%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });
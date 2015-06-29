System.register(['core-js'], function (_export) {
  'use strict';

  var core, DecoratorApplicator, Decorators, theGlobal, emptyMetadata, metadataContainerKey, Metadata, originStorage, unknownOrigin, Origin;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function ensureDecorators(target) {
    var applicator;

    if (typeof target.decorators === 'function') {
      applicator = target.decorators();
    } else {
      applicator = target.decorators;
    }

    if (typeof applicator._decorate === 'function') {
      delete target.decorators;
      applicator._decorate(target);
    } else {
      throw new Error('The return value of your decorator\'s method was not valid.');
    }
  }

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }],
    execute: function () {
      DecoratorApplicator = (function () {
        function DecoratorApplicator() {
          _classCallCheck(this, DecoratorApplicator);

          this._first = null;
          this._second = null;
          this._third = null;
          this._rest = null;
        }

        DecoratorApplicator.prototype.decorator = function decorator(_decorator) {
          if (this._first === null) {
            this._first = _decorator;
            return this;
          }

          if (this._second === null) {
            this._second = _decorator;
            return this;
          }

          if (this._third === null) {
            this._third = _decorator;
            return this;
          }

          if (this._rest === null) {
            this._rest = [];
          }

          this._rest.push(_decorator);

          return this;
        };

        DecoratorApplicator.prototype._decorate = function _decorate(target) {
          var i, ii, rest;

          if (this._first !== null) {
            this._first(target);
          }

          if (this._second !== null) {
            this._second(target);
          }

          if (this._third !== null) {
            this._third(target);
          }

          rest = this._rest;
          if (rest !== null) {
            for (i = 0, ii = rest.length; i < ii; ++i) {
              rest[i](target);
            }
          }
        };

        return DecoratorApplicator;
      })();

      _export('DecoratorApplicator', DecoratorApplicator);

      Decorators = {
        configure: {
          parameterizedDecorator: function parameterizedDecorator(name, decorator) {
            Decorators[name] = function () {
              var applicator = new DecoratorApplicator();
              return applicator[name].apply(applicator, arguments);
            };

            DecoratorApplicator.prototype[name] = function () {
              var result = decorator.apply(null, arguments);
              return this.decorator(result);
            };
          },
          simpleDecorator: function simpleDecorator(name, decorator) {
            Decorators[name] = function () {
              return new DecoratorApplicator().decorator(decorator);
            };

            DecoratorApplicator.prototype[name] = function () {
              return this.decorator(decorator);
            };
          }
        }
      };

      _export('Decorators', Decorators);

      theGlobal = (function () {
        if (typeof self !== 'undefined') {
          return self;
        }

        if (typeof global !== 'undefined') {
          return global;
        }

        return new Function('return this')();
      })();

      emptyMetadata = Object.freeze({});
      metadataContainerKey = '__metadata__';

      if (typeof theGlobal.System === 'undefined') {
        theGlobal.System = {};
      }

      if (typeof System.forEachModule === 'undefined') {
        System.forEachModule = function () {};
      }

      if (typeof theGlobal.Reflect === 'undefined') {
        theGlobal.Reflect = {};
      }

      if (typeof Reflect.getOwnMetadata === 'undefined') {
        Reflect.getOwnMetadata = function (metadataKey, target, targetKey) {
          return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
        };
      }

      if (typeof Reflect.defineMetadata === 'undefined') {
        Reflect.defineMetadata = function (metadataKey, metadataValue, target, targetKey) {
          var metadataContainer = target[metadataContainerKey] || (target[metadataContainerKey] = {});
          var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
          targetContainer[metadataKey] = metadataValue;
        };
      }

      if (typeof Reflect.metadata === 'undefined') {
        Reflect.metadata = function (metadataKey, metadataValue) {
          return function (target, targetKey) {
            Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
          };
        };
      }Metadata = {
        global: theGlobal,
        resource: 'aurelia:resource',
        paramTypes: 'design:paramtypes',
        properties: 'design:properties',
        get: function get(metadataKey, target, targetKey) {
          if (!target) {
            return undefined;
          }

          var result = Metadata.getOwn(metadataKey, target, targetKey);
          return result === undefined ? Metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
        },
        getOwn: function getOwn(metadataKey, target, targetKey) {
          if (!target) {
            return undefined;
          }

          if (target.hasOwnProperty('decorators')) {
            ensureDecorators(target);
          }

          return Reflect.getOwnMetadata(metadataKey, target, targetKey);
        },
        define: function define(metadataKey, metadataValue, target, targetKey) {
          Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
        },
        getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, targetKey) {
          var result = Metadata.getOwn(metadataKey, target, targetKey);

          if (result === undefined) {
            result = new Type();
            Reflect.defineMetadata(metadataKey, result, target, targetKey);
          }

          return result;
        }
      };

      _export('Metadata', Metadata);

      originStorage = new Map();
      unknownOrigin = Object.freeze({ moduleId: undefined, moduleMember: undefined });

      Origin = (function () {
        function Origin(moduleId, moduleMember) {
          _classCallCheck(this, Origin);

          this.moduleId = moduleId;
          this.moduleMember = moduleMember;
        }

        Origin.get = function get(fn) {
          var origin = originStorage.get(fn);

          if (origin === undefined) {
            System.forEachModule(function (key, value) {
              for (var name in value) {
                var exp = value[name];
                if (exp === fn) {
                  originStorage.set(fn, origin = new Origin(key, name));
                  return;
                }
              }

              if (value === fn) {
                originStorage.set(fn, origin = new Origin(key, 'default'));
                return;
              }
            });
          }

          return origin || unknownOrigin;
        };

        Origin.set = function set(fn, origin) {
          originStorage.set(fn, origin);
        };

        return Origin;
      })();

      _export('Origin', Origin);
    }
  };
});
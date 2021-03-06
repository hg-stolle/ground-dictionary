var _splice = function(array, begin) {
  var result = [];

  begin = begin || 0;

  // Add the ones we need
  for (var i = begin; i < array.length; i++)
    result.push(array[i]);

  return result;
};

Dictionary = function(list) {
  var self = this;
  // Dictionary
  self.lookupString = {};
  self.lookupNumber = {};
  self.lookupDate = {}; // Special lookup making sure date lookups are acurate
  self.lookupBoolean = {};

  self.list = [];

  self.initial = [];

  // If user sets a list
  if (list instanceof Dictionary) {
    // Clone the initial list
    self.initial = list.clone();
    // We set the clone
    self.set(list.clone());
  } else if (list) {
    // Clone the array
    self.initial = _splice(list);
    // Just set the list
    self.set(list);
  }

};

Dictionary.prototype.lookup = function(key) {
  var self = this;

  var lookup = self.lookupString;

  if (key instanceof Date) {
    lookup = self.lookupDate;
    key = +key;
  } else if (key === +key) {
    lookup = self.lookupNumber;
  } else if (key === !!key) {
    lookup = self.lookupBoolean;
  }

  if (arguments.length === 2) {
    // Setter
    lookup[key] = arguments[1];
  }

  return lookup[key];
};

Dictionary.prototype.add = function(value) {
  var self = this;
  // Make sure not to add existing values / words
  if (!self.exists(value)) {
    // Add value to keyword list
    // We return the index - note this can be 0 :)
    var index = this.list.push(value) - 1;
    // Set the normal lookup
    this.lookup(value, index);
  }

  return this.index(value);
};

Dictionary.prototype.addList = function(list) {
  // Iterate over the list of values
  if (list)
    for (var i = 0; i < list.length; i++)
      this.add(list[i]);
};

Dictionary.prototype.set = function(list) {
  // Reset the this.lookup
  this.lookupString = {};
  this.lookupNumber = {};
  this.lookupBoolean = {};
  this.lookupDate = {};
  this.list = [];
  // Add the list
  this.addList(list);
};

Dictionary.prototype.remove = function(value) {
  var self = this;
  // Make sure theres something to remove
  if (self.exists(value)) {
    var result = [];
    // copy the this.lookup
    for (var i = 0; i < this.list.length; i++)
      if (i !== self.index(value)) result.push(this.list[i]);
    // Set the new list of this.lookup
    this.set(result);
  }
};

Dictionary.prototype.withoutInitial = function() {
  return _splice(this.list, this.initial.length);
};

Dictionary.prototype.value = function(index) {
  return this.list[index];
};

Dictionary.prototype.index = function(value) {
  // We have to use the Date lookup in order to get the correct lookup value
  // otherwise there are some slight diviation in the result - We want this
  // 100% accurate
  return this.lookup(value);
};

Dictionary.prototype.exists = function(value) {
  return (typeof this.index(value) !== 'undefined');
};

Dictionary.prototype.clone = function() {
  return _splice(this.list);
};

Dictionary.prototype.toArray = function() {
  return this.list;
};

Dictionary.prototype.toObject = function() {
  return _.extend({}, this.lookupString, this.lookupNumber, this.lookupDate, this.lookupBoolean);
};

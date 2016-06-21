/* global $, $$, $delegate, prev, moment */
(function(window) {
  'use strict';

  /**
   * View
   */
  var View = function(template) {
    var _self = this;
    _self.template = template;

    var $sections = $('.main-section');
    var $navLinks = $('.main-nav a');
    var $next = $$('#next');
    var $countdown = $$('#countdown');
    var $homeAdd = $$('#home-add');
    var $addForm = $$('#add-form');
    var $addDate = $$('#add-date');

    var $cal = $$('#calendar-data');
    var $average = $$('#average');
    var $log = $$('#log-data');

    var $deleteAll = $$('#delete-all');
    var $settingsWeekStart = $$('#settings-week-start');

    var $settingsPeriodLength = $$('#settings-period-length');
    var $settingsPeriodLengthSub = $$('#settings-period-length-sub');
    var $settingsPeriodLengthAdd = $$('#settings-period-length-add');
    
    var _viewCommands = {};

    _viewCommands.section = function(model, parameter, args) {
      parameter = parameter || 'home';
      $sections.forEach(function($el) {
        $el.classList.remove('selected');
      });
      $$('#' + parameter).classList.add('selected');
      $navLinks.forEach(function($el) {
        if ($el.getAttribute('href') === '#/' + parameter) {
          $el.classList.add('selected');
        }
        else {
          $el.classList.remove('selected');
        }
      });
      if (parameter === 'calendar') {
        var yearN = args[0];
        var monthN = args[1];
        _viewCommands.calendar(model, monthN, yearN);
      }
    };

    _viewCommands.home = function(model) {
      $next.innerHTML = model.next;
      $countdown.innerHTML = model.countdown;
      var today = moment().format('YYYY-MM-DD');
      $addDate.defaultValue = today;
      $addDate.value = today;
    };

    _viewCommands.calendar = function(model, month, year) {
      $cal.innerHTML = _self.template.calendar(model, month, year);
    };

    _viewCommands.log = function(model) {
      $average.innerHTML = model.average;
      $log.innerHTML = _self.template.log(model);
    };

    _viewCommands.settings = function() {
      console.log('settings');
    };

    this.render = function(viewCmd, model, parameter, args) {
      _viewCommands[viewCmd](model, parameter, args);
    };

    this.bind = function(event, handler) {
      if (event === 'itemAdd') {
        $homeAdd.on('click', function() {
          $addForm.classList.add('selected');
          $addDate.focus();
          $addDate.click();
        });
        $addForm.on('submit', function(event) {
          prev(event);
          handler($addDate.value);
        });
        $addForm.on('reset', function() {
          $addForm.classList.remove('selected');
        });
      }
      else if (event === 'itemRemove') {
        $delegate($log, '.js-remove', 'click', function() {
          var $tr = this.parentNode.parentNode;
          $tr.classList.toggle('selected');
          if (window.confirm('Are you sure you want to delete `' + this.getAttribute('data-date') + '`?')) {
            handler(this.getAttribute('data-id'));
          }
          else {
            $tr.classList.toggle('selected');
          }
        });
      }
      else if (event === 'itemEdit') {
        $delegate($log, '.js-edit', 'click', function() {
          handler(this.getAttribute('data-id'));
        });
      }
      else if (event === 'itemRemoveAll') {
        $deleteAll.on('click', function() {
          if (window.confirm('Are you sure you want to delete all the entries?')) {
            handler();
          }
        });
      }
      else if (event === 'settingsUpdate') {
        $settingsWeekStart.on('change', function() {
          console.log(this.checked);
        });

        $settingsPeriodLength.on('input', function() {
          console.log(this.value);
        });
        $settingsPeriodLengthSub.on('click', function() {
          if ($settingsPeriodLength.value <= 1) {
            return;
          }
          $settingsPeriodLength.value--;
          $settingsPeriodLength.dispatchEvent(new Event('input'));
        });
        $settingsPeriodLengthAdd.on('click', function() {
          $settingsPeriodLength.value++;
          $settingsPeriodLength.dispatchEvent(new Event('input'));
        });
      }
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);
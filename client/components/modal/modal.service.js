'use strict';

angular.module('withtalkApp')
  .factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {
      show : {
        addSite: function(){
          return function() {

            var siteModal;

            siteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Add Site',
                html: '<form role="form">'+
                        '<div class="box-body">'+
                        '<div class="form-group">'+
                        '<label for="exampleInputEmail1">Site Name</label>'+
                        '<input type="text" class="form-control" id="site_name" ng-model="newSite.site_name" placeholder="Enter Site Name">'+
                        '</div>'+
                        '<div class="form-group">'+
                        '<label for="exampleInputPassword1">Site Url</label>'+
                        '<input type="text" class="form-control" id="site_url" ng-model="newSite.site_url" placeholder="Enter Site Url">'+
                        '</div>'+
                        '</div>'+
                        '</form>',
                buttons: [{
                  classes: 'btn-info',
                  text: 'Save',
                  click: function(e) {
                    siteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    siteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-info');

            siteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      },

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  });

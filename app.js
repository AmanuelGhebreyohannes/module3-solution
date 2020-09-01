(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems',foundItems);

var started=false;

NarrowItDownController.$inject = ['MenuSearchService','$scope','$filter'];
function NarrowItDownController(MenuSearchService,$scope,$filter) {
  var menu = this;


  menu.data="";
  menu.found=[];

  var promise=MenuSearchService.getMatchedMenuItems();
  promise.then(function(response){
    ////console.log(response.data);
    menu.data=response.data;

  })
  .catch(function(error){
    //console.log("error occured!");
  });
  menu.list=function(){
    ////console.log(menu.data['menu_items']);

    var list=menu.data['menu_items'];
    var Founded=[];

    for (var i=0;i<list.length;i++)
    {
      ////console.log(list[i]['description']);
      var x=""+list[i]['description']+"";
      var y=""+$scope.searchTerm+"";
      ////console.log(x,y);
      if(x.includes(y))
      {
        ////console.log("true");
        ////console.log(list[i]);
        Founded.push(list[i]);

      }


    }
    menu.found=Founded;
    started=true;
    //console.log(menu.found);
    //$scope.searchTerm="";

  }
  menu.removeItem=function(itemIndex){
    menu.found.splice(itemIndex,1);
    if(menu.found.length==0)
      started=false;
  };
  menu.errorMessage= function(){
    if(menu.found.length==0 && started==true)
    return 1;
    return 0;

  };

}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var foundItems=[];


  service.getMatchedMenuItems = function () {

    var response= $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),

    });
    return response;


  };
}

foundItems.$inject=[];
function foundItems(){
  var ddo={
    templateUrl: 'listItem.html',
    scope:{
      listFound: '<foundedItems',
      remove:'=onRemove'

    }
  };
  return ddo;
}



})();

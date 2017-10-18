//引入angular1.5.8 ---> 创建模块 --> 创建控制器 -->启动angular--->  初始化数据 ---> 绑定数据到页面上 ---> 完成主要功能 ----> 次要功能
//主要功能: 增删查改
//次要功能: 统计   状态切换  全选清除 全选

(function (window,angular) {
    //1.创建模块
    var app =  angular.module('todomvcApp',[]);
    //2、创建控制器
    app.controller('todoCtrl',['$scope',function ($scope) {
        //4、初始化数据
        $scope.todoList = [
            {status:true,content:'吃饭'},
            {status:false,content:'睡觉'},
            {status:true,content:'打游戏'}
        ];

        //6.1 添加todo
        $scope.content = '';
        $scope.addTodo = function () {
            //将数据添加到数组上
            if($scope.content !==''){
                $scope.todoList.push({
                    status:false,content:$scope.content
                });
            }
            //清空输入框
            $scope.content = '';
        }
        //6.2 删除数据
        $scope.delTodo = function (todo) {
            var index = $scope.todoList.indexOf(todo);
            $scope.todoList.splice(index,1);
        }
        //6.3 编辑数据 --- 思路：编辑状态的样式为editing，所以要修改样式为editing，则为编辑状态
        $scope.editTodo = function (todo) {
            $scope.xtodo = todo;
        }
        //6.31 input框失去焦点后，去掉样式editing
        $scope.removeXtodo = function () {
            $scope.xtodo = {};
        }
        //7.1 统计、当列表被全部选择，则按钮的样式要改变
        $scope.toggleAll = false;
        //使用数据监视
        //bug-1: 如果监视的数据为对象，则要在最后加上true，表示使用递归监视
        $scope.$watch('todoList',function (newVal,oldVal) {
            $scope.count = 0;
            $scope.tempArr = [];
            newVal.forEach(function (item,index) {
                if(item.status == true){
                    $scope.tempArr.push(item);
                }
            });
            //true 全选
            $scope.toggleAll = $scope.tempArr.length === newVal.length? true : false;
            // 未完成数
            $scope.count = newVal.length - $scope.tempArr.length;
        },true);

        //7.2 点击全选按钮，切换列表勾选状态
        $scope.changeToggle = function () {
            //思路: 点击的时候，是变成 !toggleAll， 所以只要让列表status等于!toggleAll
            $scope.todoList.forEach(function(item,index){
                item.status = !$scope.toggleAll;
            });
        }
        //7.3 状态切换：active  computed all
        //使用过滤 filter : 过滤的数据 ——> 过滤条件 ——> 触发过滤
        $scope.statusFilter = {};
        $scope.changeStatus = function (data) {
            if(data.status === false){
                $scope.statusFilter.status = false;
            }else if(data.status === true){
                $scope.statusFilter.status = true;
            }else{
                $scope.statusFilter = {};
            }
        }
        //7.4 clear 清除已完成
        //思路：使用filter可以避免遍历删除引起的index变乱
        $scope.clearCompleted = function () {
            $scope.todoList = $scope.todoList.filter(function (item) {
                return item.status === false;
            });
        }
    }]);
    //6.32 使用自定义指令 -操作dom---- 思路：失去焦点的前提是有焦点事件，所以给双击事件添加焦点
    //以属性的方式使用
    app.directive('todoFocus',function () {
        //通过link操作dom
        return {
            link:function (scope,ele,attr) {
                //ele 表示当前元素，jqLite,相当于jq对象
                //attr属性
                ele.on('dblclick',function () {
                    ele.find('input')[1].focus();
                })
            }
        }
    });
})(window,angular);
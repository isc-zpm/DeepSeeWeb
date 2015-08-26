/**
 * Main application module
 */
(function() {
    'use strict';

    angular.module('dashboard', []);
    angular.module('widgets', []);
    angular.module('templates', []);
    angular.module('utils', []);

    angular.module('app', ['ngRoute', 'ngCookies', 'cgNotify', 'gridster', 'highcharts-ng', 'ng-context-menu', 'ngDialog', 'utils', 'dashboard', 'widgets', 'templates'])

    .constant('CONST', {
        css: {
            classic: "css/metro.min.css",
            metro: "css/classic.min.css"
        },
        bgColorClasses: ["", "cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7", "cl8", "cl9"],
        fontColors: ["#000", "#FFF", "#F00", "#0A0", "#00F"],
        fontColorsMetro: ["#FFF", "#000", "#F00", "#0A0", "#00F"],
        icons: ["", "\uf0e4", "\uf114", "\uf080", "\uf1fe", "\uf200", "\uf201",
            "\uf153", "\uf155", "\uf158", "\uf0c5", "\uf03a", "\uf0ce", "\uf0d1",
            "\uf007", "\uf183", "\uf0c0", "\uf0b0", "\uf1c0", "\uf1b2", "\uf1b3",
            "\uf02d", "\uf073", "\uf0ac", "\uf005", "\uf071", "\uf05a",
            "\uf104"],
        timeout: 60000,
        ver: "1.2.21",
        emptyWidgetClass: "MDX2JSON.EmptyPortlet".toLowerCase()
    })

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/views/home.html',
                controller: 'home',
                resolve: { config: ['Connector', '$q', 'Storage', '$rootScope', '$route', configResolver] }
            })
            .when('/d/:path*', {
                templateUrl: 'src/views/dashboard.html',
                controller: 'dashboard',
                resolve: { config: ['Connector', '$q', 'Storage', '$rootScope', '$route', configResolver] }
            })
            .when('/f/:folder*', {
                templateUrl: 'src/views/home.html',
                controller: 'home',
                resolve: { config: ['Connector', '$q', 'Storage', '$rootScope', '$route', configResolver] }
            })
            .when('/login', {
                templateUrl: 'src/views/login.html',
                controller: 'login'
            })
            .otherwise({ redirectTo: '/' });
    }])

    .run(['gridsterConfig', 'Lang', 'CONST', 'Connector', '$route', start]);


    /**
     * Loads config before route changed
     * @param {object} Connector Connector service
     * @param $q
     * @param {object} Storage Storage service
     * @returns {IPromise<T>}
     */
    function configResolver(Connector, $q, Storage, $rootScope, $route) {
        var deffered = $q.defer();
        if (Storage.configLoaded) {
            $rootScope.$broadcast('toggleMenu', true);
            deffered.resolve();
            return deffered.promise;
        }
        Connector.loadConfig($route.current.params.ns).success(function(result) {
            $rootScope.$broadcast('toggleMenu', true);
            Storage.loadConfig(result);
            deffered.resolve();
        }).error(function(result) {
            deffered.resolve();
        });
        return deffered.promise;
    }

/*
    function loadConfig($q,$http) {
        var deffered = $q.defer();

        // make your http request here and resolve its promise
        return deffered.promise;
    }*/

    /**
     * Application entry point
     * @param gridsterConfig
     * @param Lang
     * @param CONST
     * @param Connector
     * @param Storage
     */
    function start(gridsterConfig, Lang, CONST, Connector, $route) {


        gridsterConfig.draggable.handle = ".widget-title-drag";
        gridsterConfig.resizable.handles = ['se'];
        gridsterConfig.columns = 12;
        gridsterConfig.floating = true;
        gridsterConfig.pushing = true;
        gridsterConfig.defaultSizeX = 2;
        gridsterConfig.defaultSizeY = 2;
        gridsterConfig.isResizing = false;
        gridsterConfig.isDragging = false;
        gridsterConfig.margins = [5, 5];

        gridsterConfig.resizable.start = function() {
            gridsterConfig.isResizing = true;
        };
        gridsterConfig.resizable.stop = function() {
            gridsterConfig.isResizing = false;
        };
        gridsterConfig.draggable.start = function() {
            gridsterConfig.isDragging = true;
        };
        gridsterConfig.draggable.stop = function() {
            gridsterConfig.isDragging = false;
        };

        /*
        gridsterConfig.resizable.resize = function(a, b, w) {
            $rootScope.$broadcast("resizeWidget" + w.$$hashKey);
        };*/

        //gridsterConfig.itemSize = ($window.innerWidth - 80) / 12;
        /*$window.onresize = function() {
            gridsterConfig.itemSize = ($window.innerWidth - 80) / 12;
            $rootScope.$broadcast("resize");
        };*/

        // TODO: add lang support
        Highcharts.setOptions({
            global: {
                useUTC: false
            },
            lang: {
                loading: "<div class='loader'></div>",
                //months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                //weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                shortMonths: Lang.get("shortMonths"),
                noData: Lang.get("noData")/*
                exportButtonTitle: "Exportar",
                printButtonTitle: "Imprimir",
                rangeSelectorFrom: "De",
                rangeSelectorTo: "Até",
                rangeSelectorZoom: "Увеличение",
                downloadPNG: 'Download imagem PNG',
                downloadJPEG: 'Download imagem JPEG',
                downloadPDF: 'Download documento PDF',
                downloadSVG: 'Download imagem SVG'*/
                // resetZoom: "Reset",
                // resetZoomTitle: "Reset,
                // thousandsSep: ".",
                // decimalPoint: ','
            }
        });


        // Load favorites
        /*Connector.getFavorites().success(function(result) {

        });*/
    }

})();
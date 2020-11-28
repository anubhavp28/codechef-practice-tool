<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

$app->get('/index.php', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->get('/index.php/hello', function (Request $request, Response $response, $args) {
    $tags = $allGetVars["tags"];
    $tags = explode(',', $tags);

    $dbh = new PDO("mysql:host=localhost;dbname=codechef", "root", "anubhav");
    foreach($dbh->query('SELECT * from problems') as $row) {
        print_r($row);
    }

    $response->getBody()->write("Hello world! 2");
    return $response;
});

$app->run();

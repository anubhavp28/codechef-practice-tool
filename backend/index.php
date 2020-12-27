<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

// :)
$USERNAME = "lol";
$PASSWORD = "lol";

$app = AppFactory::create();

$app->get('/index.php', function (Request $request, Response $response, $args) {
    $response->getBody()->write("200 - OK! <br/> <img width=\"50%\" src=\"https://i.imgur.com/R6KiXeK.jpg\"/>");
    return $response;
});


$app->get('/index.php/tags', function (Request $request, Response $response, $args) {
    $data = array();
    global $USERNAME, $PASSWORD;
    $dbh = new PDO("mysql:host=localhost;dbname=codechef", $USERNAME, $PASSWORD );
    $query = "SELECT * FROM `tags`";
    foreach($dbh->query($query) as $row) {
        $entry = (object)[];
        $entry->tag_name = $row['tag_name'];
        $entry->problem_count = $row['problem_count'];
        $entry->tag_type = $row['tag_type'];
        $data[] = $entry;
    }

    $resp = (object)[];
    $resp->message = "success";
    $resp->data = $data;
    
    $response = $response->withHeader('Content-type', 'application/json');
    $response = $response->withHeader('Access-Control-Allow-Origin', '*')
                        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    $response->getBody()->write((string)json_encode($resp));
    return $response;
});


$app->get('/index.php/problems', function (Request $request, Response $response, $args) {
    $params = $request->getQueryParams();
    $tags = $params["tags"] ?? "";
    $tags = explode(',', $tags);
    $offset = (int)($params["offset"] ?? 0);
    
    // build placeholder string
    $query_placeholder = array_fill(0, sizeof($tags), '?');
    $query_placeholder = implode(",", $query_placeholder); 

    global $USERNAME, $PASSWORD;
    $dbh = new PDO("mysql:host=localhost;dbname=codechef", $USERNAME, $PASSWORD);
    
    // get count of the problems
    $query = "  SELECT `problem_tags`.`problem_code` 
                FROM `problem_tags` 
                WHERE `tag_name` 
                IN (${query_placeholder}) 
                GROUP BY `problem_tags`.`problem_code` 
                HAVING count(*) = ?
            ";
    $sth = $dbh->prepare($query);
    $tags[] = sizeof($tags);
    $sth->execute($tags);
    $count = $sth->rowCount();

    // get problem details from given offset
    $data = array();
    $query = "  SELECT `problem_tags`.`problem_code` 
                FROM `problem_tags` 
                WHERE `tag_name` 
                IN (${query_placeholder}) 
                GROUP BY `problem_tags`.`problem_code` 
                HAVING count(*) = ?
                LIMIT ${offset}, 10 
             ";

    $sth = $dbh->prepare($query);
    $sth->execute($tags);
    $query_result = $sth->fetchAll();

    foreach ($query_result as $row) {
        $problem_code = $row['problem_code'];
        $query = "  SELECT * 
                    FROM `problems`
                    WHERE `code` = ?
                 ";         
        $sth = $dbh->prepare($query);
        $sth->execute(array($problem_code));
        $problem_details = $sth->fetch(PDO::FETCH_ASSOC);
        $entry = (object)[];
        $entry->code = $problem_details['code'];
        $entry->author = $problem_details['author'];
        $entry->solved = $problem_details['solved'];
        $entry->attempted = $problem_details['attempted'];
        $entry->partially_solved = $problem_details['partially_solved'];
        $entry->name = $problem_details['name'];
        $entry->contest_code = $problem_details['contest_code'];
        $entry->contest_name = $problem_details['contest_name'];
        $entry->date_added = $problem_details['date_added'];
        $entry->time_limit = $problem_details['time_limit'];
        $entry->challenge_type = $problem_details['challenge_type'];

        $query = "  SELECT `tag_name` 
                    FROM `problem_tags` 
                    WHERE `problem_tags`.`problem_code` = ?
                 ";
        $sth = $dbh->prepare($query);
        $sth->execute(array($problem_code));
        $problem_tags = $sth->fetchAll();
        $entry->tags = array();
        foreach ($problem_tags as $tag) {
            $entry->tags[] = $tag['tag_name'];
        }

        $data[] = $entry;
    }

    // build API response
    $resp = (object)[];
    $resp->message = "success";
    $resp->data = $data;
    $resp->count = $count;
    
    $response = $response->withHeader('Content-type', 'application/json');
    $response = $response->withHeader('Access-Control-Allow-Origin', '*')
                        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    $response->getBody()->write((string)json_encode($resp));
    return $response;
});


$app->get('/index.php/problems/{code}', function (Request $request, Response $response, $args) {
    $code = $args['code'];
    
    // fetch problem details
    global $USERNAME, $PASSWORD;
    $dbh = new PDO("mysql:host=localhost;dbname=codechef", $USERNAME, $PASSWORD);
    $query = "  SELECT * 
                FROM `problems` 
                WHERE `problems`.`code` = ?
             ";
    $sth = $dbh->prepare($query);
    $sth->execute(array($code));
    $data = $sth->fetch(PDO::FETCH_ASSOC);
    $data['tags'] = array();

    // fetch tags
    $query = "  SELECT `tag_name` 
                FROM `problem_tags` 
                WHERE `problem_tags`.`problem_code` = ?
             ";
    $sth = $dbh->prepare($query);
    $sth->execute(array($code));
    $query_result = $sth->fetchAll();
    foreach ($query_result as $row) {
        $data['tags'][] = $row['tag_name'];
    }

    $resp = (object)[];
    $resp->message = "success";
    $resp->data = $data;
    
    $response = $response->withHeader('Content-type', 'application/json');
    $response = $response->withHeader('Access-Control-Allow-Origin', '*')
                        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    $response->getBody()->write((string)json_encode($resp));
    return $response;
});


$app->run();

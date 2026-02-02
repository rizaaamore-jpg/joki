<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_GET['path'] ?? '';

switch($path) {
    case 'orders':
        handleOrders($method);
        break;
    case 'login':
        handleLogin($method);
        break;
    default:
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

function handleOrders($method) {
    $file = 'data/orders.json';
    
    switch($method) {
        case 'GET':
            $orders = json_decode(file_get_contents($file), true) ?? [];
            echo json_encode($orders);
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $orders = json_decode(file_get_contents($file), true) ?? [];
            
            $newOrder = [
                'id' => 'ELB-' . time() . '-' . rand(1000, 9999),
                'customer_name' => $data['customer_name'] ?? '',
                'customer_email' => $data['customer_email'] ?? '',
                'customer_whatsapp' => $data['customer_whatsapp'] ?? '',
                'game' => $data['game'] ?? '',
                'service' => $data['service'] ?? '',
                'current_rank' => $data['current_rank'] ?? '',
                'target_rank' => $data['target_rank'] ?? '',
                'amount' => calculateAmount($data),
                'status' => 'pending',
                'payment_method' => $data['payment_method'] ?? '',
                'payment_status' => 'unpaid',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            $orders[] = $newOrder;
            file_put_contents($file, json_encode($orders, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true, 'order' => $newOrder]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $orders = json_decode(file_get_contents($file), true) ?? [];
            $id = $_GET['id'] ?? '';
            
            foreach($orders as &$order) {
                if($order['id'] === $id) {
                    $order = array_merge($order, $data);
                    $order['updated_at'] = date('Y-m-d H:i:s');
                    break;
                }
            }
            
            file_put_contents($file, json_encode($orders, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            $orders = json_decode(file_get_contents($file), true) ?? [];
            $id = $_GET['id'] ?? '';
            
            $orders = array_filter($orders, function($order) use ($id) {
                return $order['id'] !== $id;
            });
            
            file_put_contents($file, json_encode(array_values($orders), JSON_PRETTY_PRINT));
            echo json_encode(['success' => true]);
            break;
    }
}

function handleLogin($method) {
    if($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        // In production, use database with password hashing
        if($username === 'admin' && $password === 'admin123') {
            session_start();
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_username'] = $username;
            
            echo json_encode([
                'success' => true,
                'user' => [
                    'username' => $username,
                    'name' => 'Administrator'
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    }
}

function calculateAmount($data) {
    // Calculate price based on game and service
    $prices = [
        'Mobile Legends' => [
            'Rank Boosting ML' => 150000,
            'Winrate Boosting ML' => 100000,
            'Magic Chess ML' => 80000
        ],
        'Free Fire' => [
            'Rank Boosting FF' => 120000,
            'KD Boosting FF' => 80000,
            'Clan Boosting FF' => 100000
        ],
        'Fishing Game' => [
            'Level Boosting Fishing' => 200000,
            'Currency Farming Fishing' => 50000,
            'Rare Items Fishing' => 150000
        ]
    ];
    
    $game = $data['game'] ?? '';
    $service = $data['service'] ?? '';
    
    return $prices[$game][$service] ?? 0;
}
?>

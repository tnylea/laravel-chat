<?php

echo "Shoutbox Test Script\n";
echo "===================\n\n";

// Check if BroadcastServiceProvider is registered
$appConfig = file_get_contents(__DIR__ . '/config/app.php');
if (strpos($appConfig, 'App\Providers\BroadcastServiceProvider::class') !== false) {
    echo "✅ BroadcastServiceProvider is registered in config/app.php\n";
} else {
    echo "❌ BroadcastServiceProvider is NOT registered in config/app.php\n";
}

// Check if channels.php has the shoutbox channel
$channelsFile = file_get_contents(__DIR__ . '/routes/channels.php');
if (strpos($channelsFile, "Broadcast::channel('shoutbox'") !== false) {
    echo "✅ Shoutbox channel is defined in routes/channels.php\n";
} else {
    echo "❌ Shoutbox channel is NOT defined in routes/channels.php\n";
}

// Check if NewMessage event has the correct broadcastAs method
$newMessageFile = file_get_contents(__DIR__ . '/app/Events/NewMessage.php');
if (strpos($newMessageFile, "public function broadcastAs(): string") !== false) {
    echo "✅ NewMessage event has the broadcastAs method\n";
} else {
    echo "❌ NewMessage event does NOT have the broadcastAs method\n";
}

// Check if MessageController is broadcasting correctly
$messageControllerFile = file_get_contents(__DIR__ . '/app/Http/Controllers/MessageController.php');
if (strpos($messageControllerFile, "broadcast(new NewMessage") !== false) {
    echo "✅ MessageController is broadcasting new messages\n";
} else {
    echo "❌ MessageController is NOT broadcasting new messages\n";
}

// Check if routes are protected by auth middleware
$routesFile = file_get_contents(__DIR__ . '/routes/web.php');
if (strpos($routesFile, "middleware(['auth'])") !== false) {
    echo "✅ Message routes are protected by auth middleware\n";
} else {
    echo "❌ Message routes are NOT protected by auth middleware\n";
}

// Check if Shoutbox component is listening for new messages
$shoutboxFile = file_get_contents(__DIR__ . '/resources/js/components/Shoutbox.tsx');
if (strpos($shoutboxFile, "channel.listen('.message.new'") !== false) {
    echo "✅ Shoutbox component is listening for new messages\n";
} else {
    echo "❌ Shoutbox component is NOT listening for new messages\n";
}

echo "\nTest completed. If all checks passed, the Shoutbox should be working correctly.\n";
echo "Make sure to run the Reverb server with 'php artisan reverb:start' if it's not already running.\n";

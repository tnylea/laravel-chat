<?php

$envFile = __DIR__ . '/.env';
$envContent = file_get_contents($envFile);

$reverbConfig = [
    'BROADCAST_CONNECTION=reverb',
    'REVERB_APP_ID=shoutbox',
    'REVERB_APP_KEY=shoutbox_key',
    'REVERB_APP_SECRET=shoutbox_secret',
    'REVERB_HOST=127.0.0.1',
    'REVERB_PORT=8080',
    'REVERB_SCHEME=http',
];

$missingConfig = [];
foreach ($reverbConfig as $config) {
    list($key, $value) = explode('=', $config);
    if (!strpos($envContent, $key)) {
        $missingConfig[] = $config;
    }
}

if (empty($missingConfig)) {
    echo "✅ All Reverb configuration is present in .env file.\n";
} else {
    echo "❌ The following Reverb configuration is missing from .env file:\n";
    foreach ($missingConfig as $config) {
        echo "  - $config\n";
    }
    echo "\nPlease add these lines to your .env file.\n";
}

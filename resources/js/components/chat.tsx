// ========== Imports ==========
// React and hooks
import { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';

// External libraries
import axios from 'axios';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Custom hooks
import { useEcho } from '@/hooks/use-echo';

// ========== Types ==========
/**
 * Message structure from the API
 */
interface Message {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
    };
    created_at: string;
}

/**
 * Chat Component
 * A floating chat box that displays real-time messages using Laravel Echo
 */
export default function Chat() {
    // ========== State ==========
    const [messages, setMessages] = useState<Message[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    
    // Reference to scroll to the bottom of messages
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Form state for the message input
    const { data, setData, reset, processing } = useForm({
        content: '',
    });

    // ========== WebSocket Connection ==========
    // Set up Echo to listen for new messages
    const { echo } = useEcho({
        channel: 'chatroom',             // The channel to listen on
        event: '.message.new',          // The event to listen for
        callback: handleNewMessage,     // What to do when a new message arrives
        visibility: 'public'            // This is a public channel
    });
    
    // ========== API Functions ==========
    /**
     * Fetch all messages from the API
     */
    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/messages');
            setMessages(response.data);
            setTimeout(() => scrollToBottom(), 100);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    /**
     * Send a new message via the API
     */
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Don't send empty messages
        if (!data.content.trim()) return;
        
        try {
            // Send the message to the server
            await axios.post('/api/messages', data);
            
            // Clear the input field
            reset('content');
            
            // The real-time update will happen via Echo
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // ========== Utility Functions ==========
    /**
     * Scroll to the bottom of the messages container
     */
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            // Try the standard way first
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            
            // Fallback method for some browsers
            const messagesContainer = messagesEndRef.current.parentElement;
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    };

    /**
     * Extract initials from a name (for avatar fallback)
     */
    const getInitials = (name: string) => {
        return name
            .split(' ')                  // Split on spaces
            .map(part => part[0])        // Get first character of each part
            .join('')                    // Join characters
            .toUpperCase();              // Make uppercase
    };
    
    /**
     * Check if Echo is connected to the server
     */
    const checkConnectionStatus = () => {
        if (!echo) return false;
        
        try {
            // For Pusher-based connections
            if (echo.connector && echo.connector.pusher) {
                const connectionState = echo.connector.pusher.connection.state;
                return connectionState === 'connected';
            }
            
            // For Socket.io-based connections
            if (echo.connector && echo.connector.socket) {
                return echo.connector.socket.connected === true || 
                       echo.connector.socket.readyState === 1;
            }
            
            return false;
        } catch (error) {
            console.error('Error checking connection status:', error);
            return false;
        }
    };

    // ========== Event Handlers ==========
    /**
     * Handle a new message received via Echo
     */
    function handleNewMessage(event: { message: Message }) {
        console.log('New message received:', event.message);
        
        setMessages(prevMessages => {
            // Prevent duplicate messages
            const isDuplicate = prevMessages.some(msg => msg.id === event.message.id);
            if (isDuplicate) return prevMessages;
            
            // Add new message to the list
            return [...prevMessages, event.message];
        });
        
        // Scroll to show new message
        scrollToBottom();
    }

    // ========== Effects ==========
    // Initial setup: fetch messages and check connection status
    useEffect(() => {
        // Get existing messages
        fetchMessages();
        
        // Check connection status every 5 seconds
        const connectionCheck = setInterval(() => {
            const connected = checkConnectionStatus();
            setIsConnected(connected);
        }, 5000);
        
        // Clean up the interval when component unmounts
        return () => clearInterval(connectionCheck);
    }, []); 
    
    // Refresh messages when chat is opened
    useEffect(() => {
        if (isOpen) {
            fetchMessages();
        }
    }, [isOpen]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Check connection status on page load
    setTimeout(() => {
        const initialConnection = checkConnectionStatus();
        setIsConnected(initialConnection);
    }, 100);

    // ========== Render ==========
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-80 md:w-96"
            >
                {/* Chat container */}
                <div className="shadow-xl border rounded-xl bg-white dark:bg-neutral-800 dark:border-neutral-700">
                    {/* Header/Trigger */}
                    <CollapsibleTrigger asChild>
                        <div className={`py-3 px-4 bg-white/20 ${isOpen ? 'rounded-t-xl' : 'rounded-xl'} 
                                        dark:bg-neutral-800 flex flex-row items-center justify-between 
                                        space-y-0 cursor-pointer border-b dark:border-neutral-700`}>
                            {/* Title and connection status */}
                            <div className="w-full flex items-center space-x-2">
                                <h3 className="text-md font-medium dark:text-white">Chat</h3>
                                <span className={`text-[11px] font-medium 
                                                ${isConnected ? 'text-neutral-500 dark:text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'} 
                                                flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-full px-1.5 py-1`}>
                                    {/* Connection status indicator */}
                                    <span className={`rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'} block w-3 h-3`}></span>
                                    <span className="px-1">{isConnected ? 'Connected' : 'Not Connected'}</span>
                                </span>
                            </div>
                            
                            {/* Toggle button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                            >
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronUp className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </CollapsibleTrigger>
                    
                    {/* Collapsible content - messages and input */}
                    <CollapsibleContent>
                        {/* Messages container */}
                        <div className="p-0">
                            <div className="h-80 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 ? (
                                    /* Empty state */
                                    <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
                                        No messages yet. Start the conversation!
                                    </div>
                                ) : (
                                    /* Message list */
                                    messages.map((message) => (
                                        <div key={message.id} className="flex gap-3">
                                            {/* User avatar */}
                                            <Avatar>
                                                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(message.user.name)}&background=random`} />
                                                <AvatarFallback>{getInitials(message.user.name)}</AvatarFallback>
                                            </Avatar>
                                            
                                            {/* Message content */}
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-medium text-sm dark:text-white">{message.user.name}</span>
                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{message.created_at}</span>
                                                </div>
                                                <p className="text-sm dark:text-neutral-300">{message.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {/* Hidden element for scrolling */}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        
                        {/* Message input form */}
                        <div className="p-3 border-t dark:border-neutral-700">
                            <form onSubmit={sendMessage} className="flex w-full gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    disabled={processing}
                                    className="flex-1"
                                />
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    disabled={processing || !data.content.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </div>
    );
}

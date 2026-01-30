import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import EmojiPicker from 'emoji-picker-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useChat } from '../context/ChatContext';
import CountrySelector from '../components/CountrySelector';
import { 
  ArrowLeft, Send, Search, MessageCircle, User, 
  LogOut, Languages, Clock, Check, CheckCheck,
  UserPlus, Info, MoreVertical, Reply, Copy,
  Trash2, Edit2, Pin, Volume2, Image as ImageIcon,
  Paperclip, Smile, Mic, Download, Forward,
  Bell, BellOff, CheckCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { 
    conversations, 
    messages,
    activeConversation,
    setActiveConversation,
    searchUserById,
    getOrCreateConversation,
    sendMessage,
    markAsRead,
    getTotalUnreadCount
  } = useChat();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [searchInChat, setSearchInChat] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation, messages]);

  useEffect(() => {
    if (activeConversation) {
      markAsRead(activeConversation.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation]);

  // Simulate typing indicator
  useEffect(() => {
    if (messageText) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [messageText]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchUser = () => {
    if (!searchQuery.trim()) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('الرجاء إدخال ID المستخدم', 'Please enter user ID'),
        variant: 'destructive'
      });
      return;
    }

    const foundUser = searchUserById(searchQuery.toUpperCase());
    if (foundUser) {
      const conv = getOrCreateConversation(foundUser.id);
      if (conv) {
        setActiveConversation(conv);
        setSearchDialogOpen(false);
        setSearchQuery('');
        toast({
          title: t('تم العثور على المستخدم', 'User Found'),
          description: language === 'ar' ? foundUser.name : foundUser.nameEn
        });
      }
    } else {
      toast({
        title: t('لم يتم العثور', 'Not Found'),
        description: t('لا يوجد مستخدم بهذا الـ ID', 'No user with this ID'),
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;

    if (editingMessage) {
      // Edit message logic
      toast({
        title: t('تم التعديل', 'Message Edited'),
        description: t('تم تعديل الرسالة بنجاح', 'Message edited successfully')
      });
      setEditingMessage(null);
    } else {
      sendMessage(activeConversation.id, messageText, messageText, replyingTo);
    }
    
    setMessageText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessageText(prev => prev + emojiData.emoji);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('تم النسخ', 'Copied'),
      description: t('تم نسخ الرسالة', 'Message copied')
    });
  };

  const handleDeleteMessage = (messageId) => {
    toast({
      title: t('تم الحذف', 'Deleted'),
      description: t('تم حذف الرسالة', 'Message deleted')
    });
  };

  const handleReplyToMessage = (message) => {
    setReplyingTo(message);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setMessageText(language === 'ar' ? message.text : message.textEn);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: t('تم الإرسال', 'Sent'),
        description: t('تم إرسال الصورة', 'Image sent')
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: t('تم الإرسال', 'Sent'),
        description: t('تم إرسال الملف', 'File sent')
      });
    }
  };

  const handleVoiceRecord = () => {
    toast({
      title: t('قريباً', 'Coming Soon'),
      description: t('ميزة الرسائل الصوتية قريباً', 'Voice messages coming soon')
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return t('الآن', 'Now');
    if (diff < 3600000) return Math.floor(diff / 60000) + t('د', 'm');
    if (diff < 86400000) return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const currentMessages = activeConversation ? (messages[activeConversation.id] || []) : [];
  const unreadCount = getTotalUnreadCount();

  const filteredMessages = currentMessages.filter(msg => {
    if (!searchInChat) return true;
    const text = language === 'ar' ? msg.text : msg.textEn;
    return text.toLowerCase().includes(searchInChat.toLowerCase());
  });

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/rider')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {t('المحادثات', 'Chats')}
                </h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-slate-500">
                    {unreadCount} {t('رسالة جديدة', 'new message')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('بحث بالـ ID', 'Search by ID')}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t('البحث عن مستخدم', 'Search User')}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Input
                        placeholder={t('أدخل ID المستخدم (مثال: TV12345)', 'Enter User ID (e.g., TV12345)')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                        className="h-12"
                      />
                    </div>
                    <Button
                      onClick={handleSearchUser}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {t('بحث', 'Search')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <CountrySelector />
              <Button variant="ghost" size="sm" onClick={() => navigate('/rider')}>
                <Languages className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={t('بحث...', 'Search...')}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  {t('لا توجد محادثات', 'No conversations')}
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  {t('ابحث عن مستخدم بالـ ID للبدء', 'Search for user by ID to start')}
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors relative ${
                    activeConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conv.otherUser.photo} />
                        <AvatarFallback>
                          {conv.otherUser.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.otherUser.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {language === 'ar' ? conv.otherUser.name : conv.otherUser.nameEn}
                        </h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-slate-500">
                            {formatTime(conv.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-600 truncate flex-1">
                          {conv.lastMessage 
                            ? (
                              <>
                                {conv.lastMessage.senderId === 'user1' && (
                                  <CheckCheck className="w-3 h-3 inline mr-1 text-blue-600" />
                                )}
                                {language === 'ar' ? conv.lastMessage.text : conv.lastMessage.textEn}
                              </>
                            )
                            : t('ابدأ المحادثة', 'Start conversation')
                          }
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-blue-600 hover:bg-blue-600 text-xs ml-2">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {conv.pinned && (
                    <Pin className="absolute top-2 right-2 w-3 h-3 text-blue-600" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activeConversation.otherUser.photo} />
                    <AvatarFallback>
                      {activeConversation.otherUser.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">
                      {language === 'ar' 
                        ? activeConversation.otherUser.name 
                        : activeConversation.otherUser.nameEn
                      }
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isTyping ? (
                        <span className="text-blue-600 flex items-center gap-1">
                          {t('يكتب...', 'typing...')}
                          <span className="flex gap-1">
                            <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </span>
                        </span>
                      ) : activeConversation.otherUser.status === 'online' 
                        ? t('متصل الآن', 'Online now')
                        : t('غير متصل', 'Offline')
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder={t('بحث', 'Search')}
                      value={searchInChat}
                      onChange={(e) => setSearchInChat(e.target.value)}
                      className="pl-10 h-9 w-48"
                    />
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <User className="w-3 h-3" />
                    {activeConversation.otherUser.userId}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="gap-2">
                        <Pin className="w-4 h-4" />
                        {t('تثبيت', 'Pin')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <BellOff className="w-4 h-4" />
                        {t('كتم الإشعارات', 'Mute')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-red-600">
                        <Trash2 className="w-4 h-4" />
                        {t('حذف المحادثة', 'Delete Chat')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&h=50&fit=crop&q=10')] bg-opacity-5">
                {filteredMessages.map((msg, index) => {
                  const isOwn = msg.senderId === 'user1';
                  const showAvatar = index === 0 || filteredMessages[index - 1].senderId !== msg.senderId;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'} group`}
                    >
                      {!isOwn && showAvatar && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={activeConversation.otherUser.photo} />
                          <AvatarFallback>{activeConversation.otherUser.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      {!isOwn && !showAvatar && <div className="w-8" />}
                      
                      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                        {msg.replyTo && (
                          <div className={`text-xs p-2 mb-1 rounded-lg border-l-2 ${
                            isOwn ? 'bg-blue-100 border-blue-600' : 'bg-slate-100 border-slate-400'
                          }`}>
                            <Reply className="w-3 h-3 inline mr-1" />
                            {language === 'ar' ? msg.replyTo.text : msg.replyTo.textEn}
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 shadow-sm relative group/message ${
                            isOwn
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                              : 'bg-white text-slate-900 border border-slate-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {language === 'ar' ? msg.text : msg.textEn}
                          </p>
                          {msg.edited && (
                            <span className="text-xs opacity-70 ml-2">
                              {t('(معدّلة)', '(edited)')}
                            </span>
                          )}
                          
                          {/* Message Actions */}
                          <div className={`absolute ${isOwn ? 'left-2' : 'right-2'} top-0 transform -translate-y-full opacity-0 group-hover/message:opacity-100 transition-opacity`}>
                            <div className="flex gap-1 bg-white shadow-lg rounded-lg p-1 border">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleReplyToMessage(msg)}
                              >
                                <Reply className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleCopyMessage(language === 'ar' ? msg.text : msg.textEn)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              {isOwn && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleEditMessage(msg)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-slate-500">
                            {formatTime(msg.timestamp)}
                          </span>
                          {isOwn && (
                            msg.read ? (
                              <CheckCheck className="w-3 h-3 text-blue-600" />
                            ) : (
                              <Check className="w-3 h-3 text-slate-400" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Preview */}
              {replyingTo && (
                <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Reply className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-600 font-semibold">
                        {t('الرد على', 'Replying to')}
                      </p>
                      <p className="text-sm text-slate-700 truncate max-w-md">
                        {language === 'ar' ? replyingTo.text : replyingTo.textEn}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setReplyingTo(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t bg-slate-50">
                <div className="flex items-end gap-2">
                  <div className="flex gap-1">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <ImageIcon className="w-4 h-4 text-slate-600" />
                    </Button>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder={t('اكتب رسالة...', 'Type a message...')}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-10 h-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="w-4 h-4 text-slate-600" />
                    </Button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 right-0 z-50">
                        <EmojiPicker 
                          onEmojiClick={handleEmojiClick}
                          width={350}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                  
                  {messageText.trim() ? (
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleVoiceRecord}
                      variant="ghost"
                      className="h-10 w-10 p-0"
                    >
                      <Mic className="w-5 h-5 text-blue-600" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2">
                  {t('اختر محادثة', 'Select a conversation')}
                </h3>
                <p className="text-slate-500 mb-6">
                  {t('أو ابحث عن مستخدم جديد بالـ ID للبدء', 'Or search for a new user by ID to start')}
                </p>
                <Button
                  onClick={() => setSearchDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('بحث عن مستخدم', 'Search for User')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

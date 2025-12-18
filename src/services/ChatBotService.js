class ChatBotService {
  constructor() {
    // URL của Agent Service (đã cấu hình trong docker-compose)
    this.agentApiUrl =
      import.meta.env.VITE_AI_AGENT_URL || "http://localhost:8015";

    // Khởi tạo lịch sử chat
    this.chatHistory = this.loadChatHistoryFromLocalStorage();

    // Lesson context - được set khi user vào lesson page
    this.currentLessonContext = null;

    // Thêm tin nhắn chào mừng nếu chưa có
    if (this.chatHistory.length === 0) {
      const welcomeMessage = {
        role: "bot",
        content: `Xin chào! Tôi là trợ lý EduConnect 👋
Tôi có thể giúp bạn:
- Tìm hiểu về các khóa học
- Hướng dẫn sử dụng nền tảng
- Trả lời các câu hỏi học tập
Hãy hỏi tôi bất cứ điều gì bạn cần!`,
        timestamp: new Date().toISOString(),
      };
      this.chatHistory.push(welcomeMessage);
      this.saveChatHistoryToLocalStorage();
    }
  }

  // Set lesson context khi user vào lesson page
  setCurrentLesson(lessonId, seriesId) {
    this.currentLessonContext = { lesson_id: lessonId, series_id: seriesId };
  }

  // Clear lesson context khi user rời lesson page
  clearCurrentLesson() {
    this.currentLessonContext = null;
  }

  loadChatHistoryFromLocalStorage() {
    const storedHistory = localStorage.getItem("chatHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  }

  saveChatHistoryToLocalStorage() {
    localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
  }

  clearChatHistory() {
    this.chatHistory = [];
    localStorage.removeItem("chatHistory");
    return this.chatHistory;
  }

  getChatHistory() {
    return this.chatHistory;
  }

  // Lấy User ID từ localStorage (AuthContext lưu ở đây)
  // Nếu chưa login, dùng tạm ID "guest"
  getCurrentUserId() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      // Cognito user có cognito_sub hoặc _id
      return user?.cognito_sub || user?._id || user?.id || "guest_user";
    } catch {
      return "guest_user";
    }
  }

  // Gửi tin nhắn đến AI Agent
  async sendMessage(message, skipAddingUserMessage = false) {
    try {
      if (!skipAddingUserMessage) {
        this.chatHistory.push({
          role: "user",
          content: message,
          timestamp: new Date().toISOString(),
        });
      }

      // Build payload dựa vào lesson context
      const payload = {
        user_question: message,
        user_id: this.getCurrentUserId(),
        top_k: 5,
      };

      // Nếu user đang trong lesson, gửi lesson_id và is_in_lesson
      if (this.currentLessonContext) {
        payload.lesson_id = this.currentLessonContext.lesson_id;
        payload.is_in_lesson = true;
      } else {
        // User không trong lesson, AI sẽ tư vấn chung về khóa học
        payload.lesson_id = "general_chat";
        payload.is_in_lesson = false;
      }

      const response = await fetch(`${this.agentApiUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Log lỗi chi tiết nếu có
        const errorText = await response.text();
        console.error("API Error details:", errorText);
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Lấy câu trả lời từ field 'answer' của backend
      const botResponseText =
        data.answer || "Xin lỗi, tôi không tìm thấy câu trả lời.";

      const botMessage = {
        role: "bot",
        content: botResponseText,
        timestamp: new Date().toISOString(),
      };

      this.chatHistory.push(botMessage);
      this.saveChatHistoryToLocalStorage();

      return botMessage;
    } catch (error) {
      console.error("Error in ChatBotService:", error);

      const errorMessage = {
        role: "bot",
        content: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
        timestamp: new Date().toISOString(),
        error: true,
      };

      this.chatHistory.push(errorMessage);
      this.saveChatHistoryToLocalStorage();

      throw error;
    }
  }
}

const chatBotService = new ChatBotService();
export default chatBotService;

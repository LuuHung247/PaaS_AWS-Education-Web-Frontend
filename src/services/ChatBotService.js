import { GoogleGenerativeAI } from "@google/generative-ai";

class ChatBotService {
  constructor() {
    // URL của Agent Service (đã cấu hình trong docker-compose)
    this.agentApiUrl =
      import.meta.env.VITE_AI_AGENT_URL || "http://localhost:8000";

    // Khởi tạo lịch sử chat
    this.chatHistory = this.loadChatHistoryFromLocalStorage();

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

  // Lấy User ID từ localStorage (giả định bạn lưu user info ở đó khi login)
  // Nếu chưa login, dùng tạm ID "guest"
  getCurrentUserId() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || user?._id || "guest_user";
    } catch (e) {
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

      // --- CẬP NHẬT PAYLOAD CHUẨN BACKEND ---
      // Backend yêu cầu: user_question, user_id, lesson_id
      const payload = {
        user_question: message,
        user_id: this.getCurrentUserId(),
        lesson_id: "general_chat", // ID mặc định cho chat chung
        is_in_lesson: false, // Đánh dấu là chat ngoài bài học
        top_k: 5,
      };

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

# Architecture Overview

## System Architecture

CampusConnect-AI follows a modern three-tier architecture:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Backend   │ ◄─────► │  Database   │
│  (Next.js)  │  HTTP   │  (FastAPI)  │   SQL   │ (Supabase)  │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  AI Models  │
                        │ (OpenAI/etc)│
                        └─────────────┘
```

## Components

### Frontend (Next.js)

**Technology Stack:**
- Next.js 14 (React framework)
- React 18 (UI library)
- CSS Modules (styling)

**Key Features:**
- Server-side rendering (SSR)
- Static generation for performance
- Component-based architecture
- Responsive design

**File Structure:**
```
frontend/
├── pages/           # Route-based pages
├── components/      # Reusable UI components
├── styles/          # CSS modules
└── public/          # Static assets
```

### Backend (FastAPI)

**Technology Stack:**
- FastAPI (Python web framework)
- Pydantic (data validation)
- Uvicorn (ASGI server)

**Key Features:**
- RESTful API design
- Automatic OpenAPI documentation
- Async request handling
- CORS middleware

**File Structure:**
```
backend/
├── main.py          # Application entry point
├── utils/           # Business logic
│   ├── summarizer.py    # AI summarization
│   ├── classifier.py    # Category detection
│   └── supabase_client.py # DB connection
└── tests/           # Test suite
```

### Database (Supabase)

**Technology:** PostgreSQL (via Supabase)

**Schema:**
```sql
notices
├── id (UUID, PK)
├── title (TEXT)
├── summary (TEXT)
├── category (TEXT)
├── original_content (TEXT)
└── timestamp (TIMESTAMPTZ)
```

**Indexes:**
- `idx_notices_timestamp` - Fast chronological queries
- `idx_notices_category` - Efficient category filtering

## Data Flow

### Creating a Notice

1. **Client Request:** User or webhook sends notice to `/api/notices` or `/api/webhook`
2. **Processing:**
   - Extract title and content
   - Call AI summarization service
   - Classify notice into category
3. **Storage:** Save to Supabase database
4. **Response:** Return success status and notice ID

### Retrieving Notices

1. **Client Request:** Frontend requests notices from `/api/notices`
2. **Database Query:** Backend queries Supabase with filters
3. **Response:** Return paginated results
4. **Display:** Frontend renders notices in cards

## AI Integration

### Summarization Pipeline

```
Original Text → Tokenization → AI Model → Summary
                                  ↓
                           Fallback: Simple extraction
```

**Models Supported:**
- OpenAI GPT-3.5/GPT-4
- Anthropic Claude
- Fallback: Extractive summarization

### Classification Pipeline

```
Title + Content → Feature Extraction → AI Classifier → Category
                                          ↓
                                   Fallback: Keyword matching
```

**Categories:**
- Academic, Events, Sports, Clubs, Administration
- Placement, Workshop, Scholarship, General

## Security Considerations

### Current Implementation

- CORS middleware for cross-origin requests
- Environment variable management
- Input validation via Pydantic

### Recommended Additions

- API authentication (JWT, OAuth)
- Rate limiting
- SQL injection prevention (Supabase handles this)
- XSS protection
- HTTPS enforcement

## Performance Optimization

### Backend

- Async request handling
- Database connection pooling
- Response caching (to be added)
- API rate limiting (to be added)

### Frontend

- Static generation for pages
- Image optimization
- Code splitting
- CSS optimization

### Database

- Indexed queries
- Efficient pagination
- Query optimization

## Scalability

### Horizontal Scaling

- Backend: Deploy multiple instances behind load balancer
- Frontend: Use CDN for global distribution
- Database: Supabase handles scaling automatically

### Vertical Scaling

- Increase server resources as needed
- Upgrade database plan for more connections
- Use Redis for caching

## Monitoring and Logging

### Recommended Tools

- **Error Tracking:** Sentry
- **Performance:** New Relic, DataDog
- **Logging:** ELK Stack, CloudWatch
- **Uptime:** UptimeRobot, Pingdom

## Future Enhancements

1. **Real-time Updates:** WebSocket support for live notifications
2. **User Authentication:** Student/faculty login system
3. **Email Notifications:** Subscribe to category updates
4. **Mobile App:** React Native application
5. **Advanced Search:** Full-text search with filters
6. **Analytics Dashboard:** Usage statistics and insights
7. **Multi-language Support:** Internationalization
8. **Admin Panel:** Content moderation interface

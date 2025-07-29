const authRoutes = require('./routes/auth');
const familyMemberRoutes = require('./routes/familyMembers');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/family-members', familyMemberRoutes); 
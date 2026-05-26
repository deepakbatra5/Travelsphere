-- CreateTable
CREATE TABLE "AgentDeletionRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "reason" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentDeletionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentDeletionRequest_userId_key" ON "AgentDeletionRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentDeletionRequest_agentId_key" ON "AgentDeletionRequest"("agentId");

-- AddForeignKey
ALTER TABLE "AgentDeletionRequest" ADD CONSTRAINT "AgentDeletionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDeletionRequest" ADD CONSTRAINT "AgentDeletionRequest_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
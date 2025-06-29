-- Fix score column to allow larger values
ALTER TABLE games MODIFY score DECIMAL(4,2);
ALTER TABLE rating_history MODIFY score DECIMAL(4,2);
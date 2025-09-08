import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { supabase } from '../lib/supabase';

interface MigrationStatus {
  status: 'idle' | 'checking' | 'migrating' | 'success' | 'error';
  message: string;
  progress: number;
}

export function DataMigration() {
  const { user } = useAuth();
  const { userProfile, learningProgress, syncData } = useLearning();
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    status: 'idle',
    message: '',
    progress: 0
  });

  const checkLocalData = () => {
    const localProfile = localStorage.getItem('userProfile');
    const localProgress = localStorage.getItem('learningProgress');
    
    return {
      hasProfile: !!localProfile,
      hasProgress: !!localProgress,
      profileData: localProfile ? JSON.parse(localProfile) : null,
      progressData: localProgress ? JSON.parse(localProgress) : null
    };
  };

  const migrateToCloud = async () => {
    if (!user) {
      setMigrationStatus({
        status: 'error',
        message: '请先登录账户',
        progress: 0
      });
      return;
    }

    const localData = checkLocalData();
    if (!localData.hasProfile && !localData.hasProgress) {
      setMigrationStatus({
        status: 'error',
        message: '没有找到本地数据',
        progress: 0
      });
      return;
    }

    setMigrationStatus({
      status: 'migrating',
      message: '正在迁移数据到云端...',
      progress: 10
    });

    try {
      // 迁移用户资料
      if (localData.hasProfile) {
        setMigrationStatus(prev => ({
          ...prev,
          message: '正在迁移用户资料...',
          progress: 30
        }));

        await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            display_name: localData.profileData.name,
            avatar_url: localData.profileData.avatar,
            level: localData.profileData.level,
            experience: localData.profileData.experience,
            preferences: localData.profileData.preferences,
            bookmarks: localData.profileData.bookmarks,
            notes: localData.profileData.notes,
            updated_at: new Date().toISOString(),
          });
      }

      // 迁移学习进度
      if (localData.hasProgress) {
        setMigrationStatus(prev => ({
          ...prev,
          message: '正在迁移学习进度...',
          progress: 60
        }));

        // 删除现有进度记录
        await supabase
          .from('learning_progress')
          .delete()
          .eq('user_id', user.id);

        // 插入新的进度记录
        const progressArray = Object.entries(localData.progressData).map(([itemId, progress]: [string, any]) => ({
          user_id: user.id,
          item_id: itemId,
          completed: progress.completed,
          completed_at: progress.completedAt,
          progress: progress.progress,
        }));

        if (progressArray.length > 0) {
          await supabase
            .from('learning_progress')
            .insert(progressArray);
        }
      }

      setMigrationStatus({
        status: 'success',
        message: '数据迁移完成！',
        progress: 100
      });

      // 同步数据到本地状态
      await syncData();

      // 清理本地存储（可选）
      // localStorage.removeItem('userProfile');
      // localStorage.removeItem('learningProgress');

    } catch (error) {
      console.error('数据迁移失败:', error);
      setMigrationStatus({
        status: 'error',
        message: '数据迁移失败，请重试',
        progress: 0
      });
    }
  };

  const downloadBackup = () => {
    const localData = checkLocalData();
    const backupData = {
      profile: localData.profileData,
      progress: localData.progressData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geo-learning-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const localData = checkLocalData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">数据迁移</h3>
      
      {/* 本地数据状态 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">本地数据检测</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            {localData.hasProfile ? (
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            )}
            <span>用户资料: {localData.hasProfile ? '已找到' : '未找到'}</span>
          </div>
          <div className="flex items-center">
            {localData.hasProgress ? (
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            )}
            <span>学习进度: {localData.hasProgress ? '已找到' : '未找到'}</span>
          </div>
        </div>
      </div>

      {/* 迁移状态 */}
      {migrationStatus.status !== 'idle' && (
        <div className="mb-6 p-4 rounded-lg border">
          <div className="flex items-center mb-2">
            {migrationStatus.status === 'migrating' && (
              <RefreshCw className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            )}
            {migrationStatus.status === 'success' && (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            )}
            {migrationStatus.status === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={`font-medium ${
              migrationStatus.status === 'success' ? 'text-green-700' :
              migrationStatus.status === 'error' ? 'text-red-700' :
              'text-blue-700'
            }`}>
              {migrationStatus.message}
            </span>
          </div>
          
          {migrationStatus.status === 'migrating' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${migrationStatus.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="space-y-3">
        {user ? (
          <button
            onClick={migrateToCloud}
            disabled={migrationStatus.status === 'migrating' || (!localData.hasProfile && !localData.hasProgress)}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5 mr-2" />
            迁移到云端
          </button>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            请先登录账户以使用云端迁移功能
          </div>
        )}
        
        <button
          onClick={downloadBackup}
          disabled={!localData.hasProfile && !localData.hasProgress}
          className="w-full flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          下载本地备份
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>• 迁移到云端后，您的数据将在所有设备间同步</p>
        <p>• 建议在迁移前先下载本地备份</p>
        <p>• 迁移完成后本地数据仍会保留</p>
      </div>
    </div>
  );
}

export default DataMigration;
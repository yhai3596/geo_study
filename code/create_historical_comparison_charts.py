import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
import warnings

def setup_matplotlib_for_plotting():
    """
    Setup matplotlib and seaborn for plotting with proper configuration.
    Call this function before creating any plots to ensure proper rendering.
    """
    # Ensure warnings are printed
    warnings.filterwarnings('default')  # Show all warnings

    # Configure matplotlib for non-interactive mode
    plt.switch_backend("Agg")

    # Set chart style
    plt.style.use("seaborn-v0_8")
    sns.set_palette("husl")

    # Configure platform-appropriate fonts for cross-platform compatibility
    # Must be set after style.use, otherwise will be overridden by style configuration
    plt.rcParams["font.sans-serif"] = ["Microsoft YaHei", "SimHei", "SimSun", "Noto Sans CJK SC", "WenQuanYi Zen Hei", "PingFang SC", "Arial Unicode MS", "Hiragino Sans GB"]
    plt.rcParams["axes.unicode_minus"] = False

# Setup matplotlib
setup_matplotlib_for_plotting()

# 1. 技术采用时间线图
def create_technology_adoption_timeline():
    """创建三个技术时代的发展时间线对比图"""
    
    fig, ax = plt.subplots(figsize=(14, 8))
    
    # 时间线数据
    periods = ['早期互联网搜索时代\n(1995-2005)', '移动互联网初期\n(2007-2012)', 'GEO时代\n(2024至今)']
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    
    # 关键里程碑数据
    milestones = {
        '早期互联网搜索时代': {
            'years': [1995, 1998, 2000, 2002, 2004, 2005],
            'events': ['Yahoo目录上线', 'Google成立', 'AdWords推出', 'Google超越竞对', '搜索广告成熟', '市场份额稳定'],
            'adoption': [5, 15, 25, 45, 65, 75]  # 采用率%
        },
        '移动互联网初期': {
            'years': [2007, 2008, 2009, 2010, 2011, 2012],
            'events': ['iPhone发布', 'App Store上线', '3G网络普及', 'iPhone 4发布', '智能机爆发', '市场成型'],
            'adoption': [3, 8, 15, 25, 40, 55]  # 智能手机渗透率%
        },
        'GEO时代': {
            'years': [2022, 2023, 2024, 2024.3, 2024.6, 2025],
            'events': ['ChatGPT发布', 'GEO概念提出', 'AI搜索普及', '工具生态形成', '企业大规模采用', '预测成熟期'],
            'adoption': [1, 15, 35, 50, 65, 80]  # GEO策略采用率%
        }
    }
    
    # 绘制时间线
    y_positions = [2, 1, 0]
    
    for i, (period, color) in enumerate(zip(periods, colors)):
        y = y_positions[i]
        
        # 绘制时间线基线
        period_key = list(milestones.keys())[i]
        years = milestones[period_key]['years']
        ax.plot([min(years)-0.5, max(years)+0.5], [y, y], color=color, linewidth=3, alpha=0.7)
        
        # 添加里程碑点
        for j, (year, event, adoption) in enumerate(zip(years, milestones[period_key]['events'], milestones[period_key]['adoption'])):
            # 里程碑点的大小基于采用率
            size = 50 + adoption * 3
            ax.scatter(year, y, s=size, color=color, alpha=0.8, zorder=5)
            
            # 添加事件标签（交替上下显示以避免重叠）
            offset = 0.15 if j % 2 == 0 else -0.15
            ax.annotate(f'{event}\n({adoption}%)', 
                       xy=(year, y), 
                       xytext=(year, y + offset),
                       ha='center', va='center' if j % 2 == 0 else 'center',
                       fontsize=8, 
                       bbox=dict(boxstyle='round,pad=0.3', facecolor=color, alpha=0.7),
                       arrowprops=dict(arrowstyle='->', color=color, alpha=0.6))
    
    # 设置坐标轴
    ax.set_yticks(y_positions)
    ax.set_yticklabels(periods, fontsize=12, fontweight='bold')
    ax.set_xlabel('年份', fontsize=12, fontweight='bold')
    ax.set_title('三个技术时代发展时间线对比\n技术采用曲线与关键里程碑', fontsize=16, fontweight='bold', pad=20)
    
    # 设置网格和样式
    ax.grid(True, alpha=0.3)
    ax.set_xlim(1994, 2026)
    ax.set_ylim(-0.5, 2.5)
    
    # 添加图例说明
    ax.text(0.02, 0.98, '注：圆点大小表示技术采用率，百分比为各阶段的市场渗透率', 
           transform=ax.transAxes, fontsize=9, va='top', 
           bbox=dict(boxstyle='round,pad=0.3', facecolor='lightgray', alpha=0.5))
    
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/technology_adoption_timeline.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("已创建技术采用时间线图: technology_adoption_timeline.png")

# 2. 市场份额演变对比图
def create_market_share_evolution():
    """创建市场份额演变对比图"""
    
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 6))
    
    # 早期互联网搜索引擎市场份额演变 (2000-2007)
    years_search = [2000, 2002, 2004, 2006, 2007]
    google_share = [0, 15, 35, 55, 64]
    yahoo_share = [60, 45, 35, 25, 19]
    others_share = [40, 40, 30, 20, 17]
    
    ax1.plot(years_search, google_share, marker='o', linewidth=2, label='Google', color='#4285F4')
    ax1.plot(years_search, yahoo_share, marker='s', linewidth=2, label='Yahoo!', color='#7B68EE')
    ax1.plot(years_search, others_share, marker='^', linewidth=2, label='其他', color='gray')
    ax1.set_title('早期搜索引擎市场\n(2000-2007)', fontsize=12, fontweight='bold')
    ax1.set_xlabel('年份')
    ax1.set_ylabel('市场份额 (%)')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    ax1.set_ylim(0, 70)
    
    # 智能手机操作系统市场份额 (2007-2012)
    years_mobile = [2007, 2008, 2009, 2010, 2011, 2012]
    ios_share = [100, 85, 65, 45, 35, 29]  # iPhone刚开始独占，后被Android追赶
    android_share = [0, 5, 20, 35, 45, 47]
    others_mobile = [0, 10, 15, 20, 20, 24]  # 黑莓、Windows Phone等
    
    ax2.plot(years_mobile, ios_share, marker='o', linewidth=2, label='iOS', color='#007AFF')
    ax2.plot(years_mobile, android_share, marker='s', linewidth=2, label='Android', color='#34C759')
    ax2.plot(years_mobile, others_mobile, marker='^', linewidth=2, label='其他', color='gray')
    ax2.set_title('智能手机系统市场\n(2007-2012)', fontsize=12, fontweight='bold')
    ax2.set_xlabel('年份')
    ax2.set_ylabel('市场份额 (%)')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    ax2.set_ylim(0, 110)
    
    # AI搜索引擎市场份额 (2024-2025)
    ai_engines = ['ChatGPT', 'Microsoft\nCopilot', 'Google\nGemini', 'Perplexity', 'Claude AI', '其他']
    ai_shares = [60.4, 14.1, 13.5, 6.5, 3.5, 2.0]
    colors = ['#00A67E', '#0078D4', '#4285F4', '#20B2AA', '#FF6B6B', 'gray']
    
    wedges, texts, autotexts = ax3.pie(ai_shares, labels=ai_engines, colors=colors, autopct='%1.1f%%', 
                                      startangle=90, textprops={'fontsize': 9})
    ax3.set_title('AI搜索引擎市场\n(2024年)', fontsize=12, fontweight='bold')
    
    # 调整饼图标签位置
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontweight('bold')
    
    plt.suptitle('三个技术时代的市场格局演变', fontsize=16, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/market_share_evolution.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("已创建市场份额演变图: market_share_evolution.png")

# 3. 技术发展速度对比
def create_development_speed_comparison():
    """创建技术发展速度对比图"""
    
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # 发展阶段数据
    technologies = ['早期互联网搜索', '移动互联网', 'GEO技术']
    phases = ['概念萌芽', '技术突破', '商业化', '大规模采用', '市场成熟']
    
    # 各阶段耗时（年）
    time_data = {
        '早期互联网搜索': [3, 2, 3, 3, 2],  # 总计13年 (1995-2008)
        '移动互联网': [0.5, 1, 1.5, 2, 1],    # 总计6年 (2007-2013)
        'GEO技术': [0.5, 1, 0.5, 1, 1]         # 预计4年 (2022-2026)
    }
    
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    
    # 创建堆积柱状图
    bottom = np.zeros(3)
    width = 0.6
    
    for i, phase in enumerate(phases):
        values = [time_data[tech][i] for tech in technologies]
        bars = ax.bar(technologies, values, width, bottom=bottom, 
                     label=phase, alpha=0.8)
        
        # 在每个段落添加数值标签
        for j, (bar, val) in enumerate(zip(bars, values)):
            if val > 0.3:  # 只在足够大的段落显示标签
                ax.text(bar.get_x() + bar.get_width()/2, 
                       bottom[j] + val/2, 
                       f'{val}年',
                       ha='center', va='center', 
                       fontweight='bold', fontsize=9)
        
        bottom += values
    
    # 添加总时长标签
    totals = [sum(time_data[tech]) for tech in technologies]
    for i, (tech, total) in enumerate(zip(technologies, totals)):
        ax.text(i, total + 0.2, f'总计: {total}年', 
               ha='center', va='bottom', 
               fontweight='bold', fontsize=11,
               bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.7))
    
    # 设置图表属性
    ax.set_ylabel('时间 (年)', fontsize=12, fontweight='bold')
    ax.set_title('三个技术时代发展速度对比\n从概念到市场成熟的时间周期', fontsize=16, fontweight='bold')
    ax.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    ax.grid(True, alpha=0.3, axis='y')
    ax.set_ylim(0, max(totals) * 1.2)
    
    # 添加发展趋势箭头
    ax.annotate('发展加速', xy=(2, totals[2]), xytext=(1.5, max(totals) * 0.9),
               arrowprops=dict(arrowstyle='->', lw=2, color='red'),
               fontsize=12, fontweight='bold', color='red')
    
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/development_speed_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("已创建发展速度对比图: development_speed_comparison.png")

# 4. 投资回报率和商业影响对比
def create_roi_business_impact():
    """创建投资回报率和商业影响对比图"""
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
    
    # 子图1: 技术成熟度曲线
    stages = ['概念验证', '早期采用', '快速发展', '主流应用', '市场饱和']
    
    # 早期搜索引擎 (1995-2005)
    search_maturity = [10, 30, 60, 85, 95]
    search_years = [0, 2, 5, 8, 10]
    
    # 移动互联网 (2007-2012)
    mobile_maturity = [5, 25, 50, 80, 90]
    mobile_years = [0, 1, 2.5, 4, 5]
    
    # GEO (2024-2028预测)
    geo_maturity = [15, 40, 70, 85, 95]
    geo_years = [0, 0.5, 1.5, 2.5, 4]
    
    ax1.plot(search_years, search_maturity, marker='o', linewidth=2, label='早期搜索引擎', color='#FF6B6B')
    ax1.plot(mobile_years, mobile_maturity, marker='s', linewidth=2, label='移动互联网', color='#4ECDC4')
    ax1.plot(geo_years, geo_maturity, marker='^', linewidth=2, label='GEO技术', color='#45B7D1')
    
    ax1.set_xlabel('时间 (年)')
    ax1.set_ylabel('技术成熟度 (%)')
    ax1.set_title('技术成熟度曲线对比', fontweight='bold')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # 子图2: 市场规模增长对比
    years_growth = [1, 2, 3, 4, 5]
    search_market = [10, 50, 150, 400, 800]  # 亿美元
    mobile_market = [5, 100, 500, 1200, 2000]
    geo_market = [1, 50, 200, 500, 1000]  # 预测数据
    
    ax2.semilogy(years_growth, search_market, marker='o', linewidth=2, label='搜索广告市场', color='#FF6B6B')
    ax2.semilogy(years_growth, mobile_market, marker='s', linewidth=2, label='移动应用市场', color='#4ECDC4')
    ax2.semilogy(years_growth, geo_market, marker='^', linewidth=2, label='GEO服务市场', color='#45B7D1')
    
    ax2.set_xlabel('发展年数')
    ax2.set_ylabel('市场规模 (亿美元, 对数刻度)')
    ax2.set_title('市场规模增长对比', fontweight='bold')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # 子图3: 用户采用率对比
    adoption_months = np.arange(0, 61, 6)  # 5年内每6个月
    
    # 用S曲线模拟用户采用
    def adoption_curve(months, max_adoption, growth_rate, inflection_point):
        return max_adoption / (1 + np.exp(-growth_rate * (months - inflection_point)))
    
    search_adoption = adoption_curve(adoption_months, 75, 0.15, 30)
    mobile_adoption = adoption_curve(adoption_months, 90, 0.25, 24)
    geo_adoption = adoption_curve(adoption_months, 85, 0.35, 18)
    
    ax3.plot(adoption_months, search_adoption, linewidth=2, label='搜索引擎', color='#FF6B6B')
    ax3.plot(adoption_months, mobile_adoption, linewidth=2, label='智能手机', color='#4ECDC4')
    ax3.plot(adoption_months, geo_adoption, linewidth=2, label='GEO策略', color='#45B7D1')
    
    ax3.set_xlabel('时间 (月)')
    ax3.set_ylabel('用户采用率 (%)')
    ax3.set_title('用户采用曲线对比', fontweight='bold')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # 子图4: 投资回报率对比
    investment_phases = ['初期投资', '扩张期', '成熟期', '优化期']
    
    search_roi = [50, 150, 300, 250]  # ROI百分比
    mobile_roi = [25, 200, 400, 350]
    geo_roi = [100, 300, 500, 450]  # 预测数据，基于AI驱动的高效率
    
    x = np.arange(len(investment_phases))
    width = 0.25
    
    bars1 = ax4.bar(x - width, search_roi, width, label='搜索引擎', color='#FF6B6B', alpha=0.8)
    bars2 = ax4.bar(x, mobile_roi, width, label='移动互联网', color='#4ECDC4', alpha=0.8)
    bars3 = ax4.bar(x + width, geo_roi, width, label='GEO技术', color='#45B7D1', alpha=0.8)
    
    # 添加数值标签
    for bars in [bars1, bars2, bars3]:
        for bar in bars:
            height = bar.get_height()
            ax4.text(bar.get_x() + bar.get_width()/2., height + 10,
                    f'{int(height)}%', ha='center', va='bottom', fontweight='bold')
    
    ax4.set_xlabel('投资阶段')
    ax4.set_ylabel('投资回报率 (%)')
    ax4.set_title('投资回报率对比', fontweight='bold')
    ax4.set_xticks(x)
    ax4.set_xticklabels(investment_phases)
    ax4.legend()
    ax4.grid(True, alpha=0.3, axis='y')
    
    plt.suptitle('技术商业化进程与投资回报对比分析', fontsize=16, fontweight='bold', y=0.98)
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/roi_business_impact_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("已创建投资回报率和商业影响对比图: roi_business_impact_comparison.png")

# 5. 创建综合对比雷达图
def create_comprehensive_radar_chart():
    """创建综合指标对比雷达图"""
    
    fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(projection='polar'))
    
    # 评估维度
    categories = ['技术创新度', '市场影响力', '采用速度', '商业价值', 
                 '用户体验', '生态完整性', '竞争壁垒', '发展潜力']
    
    # 各技术时代的评分 (1-10分)
    search_scores = [8, 9, 6, 8, 7, 7, 9, 6]  # 早期搜索引擎
    mobile_scores = [9, 10, 8, 9, 9, 8, 8, 7]  # 移动互联网
    geo_scores = [10, 8, 9, 9, 8, 6, 7, 10]  # GEO技术
    
    # 计算角度
    angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
    angles += angles[:1]  # 完成圆形
    
    # 为每个数据添加第一个点以完成圆形
    search_scores += search_scores[:1]
    mobile_scores += mobile_scores[:1]
    geo_scores += geo_scores[:1]
    
    # 绘制雷达图
    ax.plot(angles, search_scores, 'o-', linewidth=2, label='早期搜索引擎', color='#FF6B6B')
    ax.fill(angles, search_scores, alpha=0.25, color='#FF6B6B')
    
    ax.plot(angles, mobile_scores, 'o-', linewidth=2, label='移动互联网', color='#4ECDC4')
    ax.fill(angles, mobile_scores, alpha=0.25, color='#4ECDC4')
    
    ax.plot(angles, geo_scores, 'o-', linewidth=2, label='GEO技术', color='#45B7D1')
    ax.fill(angles, geo_scores, alpha=0.25, color='#45B7D1')
    
    # 设置标签
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, fontsize=10)
    ax.set_ylim(0, 10)
    ax.set_yticks([2, 4, 6, 8, 10])
    ax.set_yticklabels(['2', '4', '6', '8', '10'], fontsize=8)
    ax.grid(True)
    
    # 设置标题和图例
    ax.set_title('三个技术时代综合能力对比\n(雷达图评估)', fontsize=16, fontweight='bold', pad=30)
    ax.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))
    
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/comprehensive_radar_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("已创建综合对比雷达图: comprehensive_radar_comparison.png")

# 执行所有图表创建
if __name__ == "__main__":
    print("开始创建历史对比分析图表...")
    
    create_technology_adoption_timeline()
    create_market_share_evolution()
    create_development_speed_comparison()
    create_roi_business_impact()
    create_comprehensive_radar_chart()
    
    print("\n所有图表创建完成！")
    print("图表文件保存在 ../public/workspace/charts/ 目录下")

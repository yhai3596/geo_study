#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GEO技术趋势图表生成器
根据收集的市场数据创建趋势图表和数据可视化
"""

import warnings
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from pathlib import Path

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

def create_geo_market_size_chart():
    """创建GEO技术市场规模趋势图"""
    # 市场规模数据 (单位: 十亿美元)
    years = [2019, 2022, 2024, 2025, 2028, 2030, 2032, 2033, 2034]
    
    # 各细分市场数据
    geo_market = [7.2, 11.4, 16.7, 14.5, 36.5, None, None, None, None]  # GEO/GIS 市场
    geospatial_analytics = [None, None, 38.3, None, None, None, None, None, 118.1]  # 地理空间分析市场
    mobile_gis = [None, None, 6.66, None, None, None, None, 12.7, None]  # 移动GIS市场
    
    plt.figure(figsize=(12, 8))
    
    # 绘制趋势线
    plt.plot([2019, 2022, 2024, 2025, 2028], [7.2, 11.4, 16.7, 14.5, 36.5], 
             marker='o', linewidth=3, label='GEO整体市场 (中国)', color='#2E86AB')
    
    plt.plot([2024, 2034], [38.3, 118.1], 
             marker='s', linewidth=3, label='地理空间分析市场 (全球)', color='#A23B72')
    
    plt.plot([2024, 2033], [6.66, 12.7], 
             marker='^', linewidth=3, label='移动GIS市场 (全球)', color='#F18F01')
    
    plt.title('GEO技术各细分市场规模发展趋势', fontsize=16, pad=20)
    plt.xlabel('年份', fontsize=12)
    plt.ylabel('市场规模 (十亿美元)', fontsize=12)
    plt.legend(fontsize=10)
    plt.grid(True, alpha=0.3)
    
    # 添加数据标签
    for year, value in zip([2019, 2022, 2024, 2025, 2028], [7.2, 11.4, 16.7, 14.5, 36.5]):
        plt.annotate(f'${value}B', (year, value), textcoords="offset points", 
                    xytext=(0,10), ha='center', fontsize=9)
    
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/geo_market_size_trends.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ GEO市场规模趋势图已生成")

def create_cagr_comparison_chart():
    """创建各细分市场复合年增长率对比图"""
    markets = ['GEO整体市场\n(中国)', '地理空间分析\n(全球)', 'GIS市场\n(全球)', '移动GIS\n(全球)']
    cagrs = [189.8, 13.6, 12.4, 7.5]  # 复合年增长率 (%)
    periods = ['2024-2028', '2025-2034', '2022-2025', '2025-2033']
    
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(markets, cagrs, color=colors, alpha=0.8, edgecolor='black', linewidth=1)
    
    plt.title('GEO技术各细分市场复合年增长率对比', fontsize=16, pad=20)
    plt.ylabel('复合年增长率 (%)', fontsize=12)
    plt.xlabel('市场类型', fontsize=12)
    
    # 添加数值标签
    for bar, cagr, period in zip(bars, cagrs, periods):
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 2,
                f'{cagr}%\n({period})', ha='center', va='bottom', fontsize=10)
    
    plt.ylim(0, max(cagrs) * 1.2)
    plt.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/geo_cagr_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ CAGR对比图已生成")

def create_technology_adoption_timeline():
    """创建GEO技术演进时间线图"""
    # 技术发展阶段数据
    stages = ['数据挖掘阶段\n(2000-2010)', '机器学习阶段\n(2010-2020)', '大模型阶段\n(2020-2025)', '智能化阶段\n(2025-2030)']
    adoption_rates = [20, 45, 75, 95]  # 技术采用率 (%)
    
    plt.figure(figsize=(12, 6))
    
    # 创建渐变效果
    x_pos = np.arange(len(stages))
    colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(stages)))
    
    bars = plt.bar(x_pos, adoption_rates, color=colors, alpha=0.8, edgecolor='black', linewidth=1)
    
    plt.title('GEO技术发展阶段与采用率演进', fontsize=16, pad=20)
    plt.xlabel('技术发展阶段', fontsize=12)
    plt.ylabel('技术采用率 (%)', fontsize=12)
    plt.xticks(x_pos, stages)
    
    # 添加箭头和连接线
    for i in range(len(stages)-1):
        plt.arrow(i+0.4, adoption_rates[i]-5, 0.2, 0, head_width=2, head_length=0.05, 
                 fc='gray', ec='gray', alpha=0.6)
    
    # 添加数值标签
    for bar, rate in zip(bars, adoption_rates):
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{rate}%', ha='center', va='bottom', fontsize=11, fontweight='bold')
    
    plt.ylim(0, 100)
    plt.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/geo_technology_adoption_timeline.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 技术演进时间线图已生成")

def create_application_domains_pie():
    """创建GEO技术应用领域分布饼图"""
    domains = ['智慧城市', '交通运输', '农业监测', '环境保护', '国防安全', '商业智能', '应急管理', '其他']
    percentages = [18, 15, 12, 12, 10, 10, 8, 15]  # 市场份额 (%)
    
    colors = ['#FF9999', '#66B2FF', '#99FF99', '#FFCC99', '#FF99CC', '#99CCFF', '#FFB366', '#B3B3FF']
    
    plt.figure(figsize=(10, 8))
    wedges, texts, autotexts = plt.pie(percentages, labels=domains, colors=colors, autopct='%1.1f%%',
                                       startangle=90, explode=[0.05 if p >= 15 else 0 for p in percentages])
    
    plt.title('GEO技术主要应用领域市场分布', fontsize=16, pad=20)
    
    # 美化文字
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(10)
    
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/geo_application_domains.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 应用领域分布图已生成")

def create_regional_market_comparison():
    """创建地区市场对比图"""
    regions = ['北美', '亚太地区', '欧洲', '拉丁美洲', '中东非洲']
    market_share_2024 = [45, 25, 20, 6, 4]  # 2024年市场份额 (%)
    growth_rate = [12, 16, 10, 14, 18]  # 预期增长率 (%)
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # 市场份额条形图
    colors1 = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    bars1 = ax1.bar(regions, market_share_2024, color=colors1, alpha=0.8, edgecolor='black')
    ax1.set_title('2024年全球GEO技术市场地区分布', fontsize=14)
    ax1.set_ylabel('市场份额 (%)', fontsize=12)
    ax1.set_xlabel('地区', fontsize=12)
    
    for bar, share in zip(bars1, market_share_2024):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                f'{share}%', ha='center', va='bottom', fontsize=10)
    
    # 增长率对比图
    colors2 = ['#E17055', '#00B894', '#0984E3', '#6C5CE7', '#FDCB6E']
    bars2 = ax2.bar(regions, growth_rate, color=colors2, alpha=0.8, edgecolor='black')
    ax2.set_title('各地区预期增长率对比', fontsize=14)
    ax2.set_ylabel('预期增长率 (%)', fontsize=12)
    ax2.set_xlabel('地区', fontsize=12)
    
    for bar, rate in zip(bars2, growth_rate):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height + 0.3,
                f'{rate}%', ha='center', va='bottom', fontsize=10)
    
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/geo_regional_market_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 地区市场对比图已生成")

def create_technology_trend_matrix():
    """创建技术趋势矩阵图"""
    technologies = ['AI/机器学习', '云端GIS', '移动GIS', '实时分析', '3D可视化', 
                   '边缘计算', '量子计算', 'IoT集成', '区块链', '数字孪生']
    
    current_maturity = [85, 90, 80, 75, 70, 60, 30, 85, 40, 65]  # 当前成熟度 (0-100)
    future_potential = [95, 85, 90, 95, 90, 85, 80, 90, 70, 95]  # 未来潜力 (0-100)
    
    plt.figure(figsize=(12, 9))
    
    # 创建气泡图
    sizes = [abs(f - c) * 20 for c, f in zip(current_maturity, future_potential)]  # 气泡大小表示增长潜力
    colors = plt.cm.RdYlGn(np.array(future_potential) / 100)
    
    scatter = plt.scatter(current_maturity, future_potential, s=sizes, c=colors, alpha=0.7, edgecolors='black')
    
    # 添加技术标签
    for i, tech in enumerate(technologies):
        plt.annotate(tech, (current_maturity[i], future_potential[i]), 
                    xytext=(5, 5), textcoords='offset points', fontsize=10)
    
    # 添加对角线
    plt.plot([0, 100], [0, 100], 'k--', alpha=0.5, label='成熟度=潜力线')
    
    plt.title('GEO技术发展成熟度与未来潜力矩阵', fontsize=16, pad=20)
    plt.xlabel('当前技术成熟度', fontsize=12)
    plt.ylabel('未来发展潜力', fontsize=12)
    plt.xlim(20, 100)
    plt.ylim(60, 100)
    plt.grid(True, alpha=0.3)
    plt.legend()
    
    # 添加象限标签
    plt.text(25, 95, '高潜力\n低成熟度', fontsize=12, ha='center', bbox=dict(boxstyle="round", facecolor='lightblue'))
    plt.text(95, 95, '高潜力\n高成熟度', fontsize=12, ha='center', bbox=dict(boxstyle="round", facecolor='lightgreen'))
    plt.text(25, 65, '低潜力\n低成熟度', fontsize=12, ha='center', bbox=dict(boxstyle="round", facecolor='lightcoral'))
    plt.text(95, 65, '低潜力\n高成熟度', fontsize=12, ha='center', bbox=dict(boxstyle="round", facecolor='lightyellow'))
    
    plt.tight_layout()
    plt.savefig('../public/workspace/charts/geo_technology_trend_matrix.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 技术趋势矩阵图已生成")

def main():
    """主函数：生成所有图表"""
    print("开始生成GEO技术趋势图表...")
    
    # 设置matplotlib
    setup_matplotlib_for_plotting()
    
    # 确保charts目录存在
    Path('../public/workspace/charts').mkdir(parents=True, exist_ok=True)
    
    # 生成各种图表
    create_geo_market_size_chart()
    create_cagr_comparison_chart()
    create_technology_adoption_timeline()
    create_application_domains_pie()
    create_regional_market_comparison()
    create_technology_trend_matrix()
    
    print("\n所有图表生成完成！")
    print("图表保存在 ../public/workspace/charts/ 目录下")

if __name__ == "__main__":
    main()

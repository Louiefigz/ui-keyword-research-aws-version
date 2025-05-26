<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keyword Research Automation - UI Mockups</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
            color: #374151;
            line-height: 1.5;
        }

        /* Navigation */
        .navbar {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px;
        }

        .navbar-left {
            display: flex;
            align-items: center;
        }

        .navbar-title {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
        }

        .project-selector {
            margin-left: 32px;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: white;
            font-size: 14px;
        }

        .navbar-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .user-info {
            font-size: 14px;
            color: #6b7280;
        }

        /* Layout */
        .main-layout {
            display: flex;
            height: calc(100vh - 64px);
        }

        .sidebar {
            width: 256px;
            background: white;
            border-right: 1px solid #e5e7eb;
            padding-top: 32px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 12px 16px;
            margin: 0 16px;
            border-radius: 8px;
            background: none;
            border: none;
            text-align: left;
            cursor: pointer;
            transition: background-color 0.2s;
            color: #374151;
        }

        .nav-item:hover {
            background-color: #f3f4f6;
        }

        .nav-item.active {
            background-color: #dbeafe;
            color: #1d4ed8;
        }

        .nav-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
        }

        .content-area {
            flex: 1;
            padding: 32px;
            overflow-y: auto;
        }

        /* Screens */
        .screen {
            display: none;
        }

        .screen.active {
            display: block;
        }

        /* Common Components */
        .card {
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .card-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
        }

        .card-content {
            padding: 24px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-primary {
            background-color: #3b82f6;
            color: white;
        }

        .btn-primary:hover {
            background-color: #2563eb;
        }

        .btn-secondary {
            background-color: #f3f4f6;
            color: #374151;
        }

        .btn-secondary:hover {
            background-color: #e5e7eb;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-green {
            background-color: #d1fae5;
            color: #065f46;
        }

        .badge-blue {
            background-color: #dbeafe;
            color: #1e40af;
        }

        .badge-orange {
            background-color: #fed7aa;
            color: #c2410c;
        }

        .badge-purple {
            background-color: #e9d5ff;
            color: #7c2d12;
        }

        .badge-red {
            background-color: #fecaca;
            color: #dc2626;
        }

        /* Grid Systems */
        .grid {
            display: grid;
            gap: 24px;
        }

        .grid-2 {
            grid-template-columns: repeat(2, 1fr);
        }

        .grid-3 {
            grid-template-columns: repeat(3, 1fr);
        }

        .grid-4 {
            grid-template-columns: repeat(4, 1fr);
        }

        /* Forms */
        .form-group {
            margin-bottom: 24px;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
        }

        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: white;
            font-size: 14px;
        }

        /* Page Headers */
        .page-header {
            margin-bottom: 32px;
        }

        .page-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }

        .page-subtitle {
            color: #6b7280;
        }

        /* Loading Spinner */
        .loading-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Tables */
        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th,
        .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        .table th {
            background-color: #f9fafb;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            color: #6b7280;
        }

        .table tr:hover {
            background-color: #f9fafb;
        }

        /* Specific Screen Styles */
        
        /* Upload Screen */
        .upload-area {
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 64px 32px;
            text-align: center;
            background: white;
            transition: border-color 0.2s;
            margin-bottom: 24px;
        }

        .upload-area:hover {
            border-color: #3b82f6;
        }

        .upload-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 16px;
            color: #9ca3af;
        }

        .supported-tools {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
        }

        .tool-badge {
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin: 2px;
        }

        /* Dashboard Screen */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            padding: 24px;
        }

        .stat-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 14px;
            color: #6b7280;
        }

        .dashboard-layout {
            display: flex;
            gap: 32px;
        }

        .filters-sidebar {
            width: 320px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            padding: 24px;
            height: fit-content;
        }

        .main-content {
            flex: 1;
        }

        .table-controls {
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            padding: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .pagination {
            background: white;
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: between;
            align-items: center;
        }

        /* Clusters Screen */
        .cluster-card {
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            padding: 24px;
            transition: box-shadow 0.2s;
            cursor: pointer;
        }

        .cluster-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .cluster-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .cluster-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
        }

        .cluster-metrics {
            margin-bottom: 16px;
        }

        .metric-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .metric-label {
            color: #6b7280;
        }

        .metric-value {
            font-weight: 500;
        }

        .cluster-keywords {
            margin-bottom: 16px;
        }

        .keyword-tag {
            display: inline-block;
            background-color: #eff6ff;
            color: #1d4ed8;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin: 2px;
        }

        .cluster-recommendation {
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #374151;
        }

        /* Strategic Advice Screen */
        .executive-summary {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 8px;
            border: 1px solid #bfdbfe;
            padding: 32px;
            margin-bottom: 32px;
        }

        .summary-title {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
        }

        .summary-metric {
            text-align: center;
        }

        .summary-metric-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 4px;
        }

        .summary-metric-value {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 4px;
        }

        .summary-metric-desc {
            font-size: 14px;
            color: #6b7280;
        }

        .tabs {
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 32px;
        }

        .tab-nav {
            display: flex;
            gap: 32px;
        }

        .tab-button {
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            padding: 12px 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            transition: all 0.2s;
        }

        .tab-button:hover {
            color: #374151;
            border-bottom-color: #d1d5db;
        }

        .tab-button.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .opportunity-card {
            border-left: 4px solid #10b981;
            padding-left: 16px;
            margin-bottom: 16px;
        }

        .opportunity-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }

        .opportunity-title {
            font-weight: 500;
            color: #111827;
        }

        .opportunity-improvement {
            font-size: 14px;
            color: #10b981;
            font-weight: 500;
        }

        .opportunity-metrics {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .opportunity-details {
            font-size: 14px;
            color: #374151;
            margin-bottom: 4px;
        }

        .opportunity-action {
            font-size: 12px;
            color: #6b7280;
        }

        /* Projects Screen */
        .projects-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
        }

        .project-card {
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            padding: 24px;
            transition: box-shadow 0.2s;
        }

        .project-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .project-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .project-card-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
        }

        .project-card-description {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 16px;
        }

        .project-stats {
            margin-bottom: 16px;
        }

        .project-actions {
            display: flex;
            gap: 8px;
        }

        .project-actions .btn {
            flex: 1;
            text-align: center;
        }

        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 16px;
        }

        .modal.hidden {
            display: none;
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            background: white;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
        }

        .modal-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 4px;
        }

        .modal-close:hover {
            color: #6b7280;
        }

        .modal-body {
            padding: 24px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .dashboard-layout {
                flex-direction: column;
            }
            
            .filters-sidebar {
                width: 100%;
            }
        }

        @media (max-width: 768px) {
            .main-layout {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .nav-item {
                margin: 0 8px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .summary-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="navbar-left">
            <h1 class="navbar-title">SEO Research Pro</h1>
            <select class="project-selector">
                <option>Water Damage Restoration - Dallas</option>
                <option>Legal Services - Austin</option>
                <option>+ Create New Project</option>
            </select>
        </div>
        <div class="navbar-right">
            <button onclick="showScreen('projects')" style="background: none; border: none; cursor: pointer; color: #6b7280;">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                </svg>
            </button>
            <div class="user-info">user@example.com</div>
        </div>
    </nav>

    <div class="main-layout">
        <!-- Sidebar -->
        <div class="sidebar">
            <button onclick="showScreen('upload')" class="nav-item">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Upload CSV
            </button>
            <button onclick="showScreen('dashboard')" class="nav-item">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Dashboard
            </button>
            <button onclick="showScreen('clusters')" class="nav-item">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Clusters
            </button>
            <button onclick="showScreen('strategic')" class="nav-item">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                Strategic Advice
            </button>
        </div>

        <!-- Main Content -->
        <div class="content-area">
            
            <!-- Projects Management Screen -->
            <div id="projects-screen" class="screen">
                <div class="projects-header">
                    <div>
                        <h2 class="page-title">Your Projects</h2>
                    </div>
                    <button class="btn btn-primary">+ New Project</button>
                </div>

                <div class="project-grid">
                    <div class="project-card">
                        <div class="project-card-header">
                            <h3 class="project-card-title">Water Damage Restoration</h3>
                            <button style="background: none; border: none; color: #9ca3af; cursor: pointer;">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                </svg>
                            </button>
                        </div>
                        <p class="project-card-description">Dallas area water damage restoration services</p>
                        <div class="project-stats">
                            <div class="metric-row">
                                <span class="metric-label">Keywords:</span>
                                <span class="metric-value">1,247</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Clusters:</span>
                                <span class="metric-value">23</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Status:</span>
                                <span class="metric-value" style="color: #10b981;">Active</span>
                            </div>
                        </div>
                        <div class="project-actions">
                            <button class="btn btn-secondary">View</button>
                            <button class="btn" style="color: #dc2626;">Archive</button>
                        </div>
                    </div>

                    <div class="project-card">
                        <div class="project-card-header">
                            <h3 class="project-card-title">Legal Services</h3>
                            <button style="background: none; border: none; color: #9ca3af; cursor: pointer;">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                </svg>
                            </button>
                        </div>
                        <p class="project-card-description">Personal injury law firm in Austin</p>
                        <div class="project-stats">
                            <div class="metric-row">
                                <span class="metric-label">Keywords:</span>
                                <span class="metric-value">892</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Clusters:</span>
                                <span class="metric-value">18</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Status:</span>
                                <span class="metric-value" style="color: #10b981;">Active</span>
                            </div>
                        </div>
                        <div class="project-actions">
                            <button class="btn btn-secondary">View</button>
                            <button class="btn" style="color: #dc2626;">Archive</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CSV Upload Screen -->
            <div id="upload-screen" class="screen active">
                <div class="page-header">
                    <h2 class="page-title">CSV Data Management</h2>
                    <p class="page-subtitle">Upload new data or update existing keyword research</p>
                </div>

                <!-- Upload Mode Tabs -->
                <div class="tabs" style="margin-bottom: 24px;">
                    <div class="tab-nav">
                        <button onclick="showUploadTab('new')" class="tab-button active" id="new-upload-tab">
                            New Upload
                        </button>
                        <button onclick="showUploadTab('update')" class="tab-button" id="update-upload-tab">
                            Update Existing
                        </button>
                    </div>
                </div>

                <!-- New Upload Tab -->
                <div id="new-upload-content" class="tab-content active">
                    <!-- Upload Area -->
                    <div class="upload-area">
                        <svg class="upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                                <label style="cursor: pointer;">
                                    <span style="color: #3b82f6; font-weight: 500;">Click to upload</span>
                                    <span> or drag and drop</span>
                                </label>
                            </div>
                            <p style="font-size: 12px; color: #6b7280;">CSV files up to 50MB</p>
                        </div>
                        <button class="btn btn-primary" onclick="showSchemaPreview()">Select File</button>
                    </div>

                    <!-- Supported Tools -->
                    <div class="supported-tools">
                        <h3 style="font-size: 14px; font-weight: 500; color: #1e40af; margin-bottom: 8px;">Supported SEO Tools</h3>
                        <div>
                            <span class="tool-badge">Ahrefs</span>
                            <span class="tool-badge">SEMrush</span>
                            <span class="tool-badge">Moz</span>
                            <span class="tool-badge">Content Gap Analysis</span>
                        </div>
                    </div>
                </div>

                <!-- Update Existing Tab -->
                <div id="update-upload-content" class="tab-content">
                    <!-- Update Upload Area -->
                    <div class="upload-area">
                        <svg class="upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v5h.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15M7 17l4-4 4 4m-4-4v18"></path>
                        </svg>
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 16px; font-weight: 500; color: #111827; margin-bottom: 4px;">Update Existing Keywords</div>
                            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                                Upload a new CSV to update your existing keyword data
                            </div>
                            <p style="font-size: 12px; color: #6b7280;">New data will be merged with existing keywords</p>
                        </div>
                        <button class="btn btn-primary" onclick="showUpdatePreview()">Select Update File</button>
                    </div>

                    <!-- Update Strategy -->
                    <div class="card" style="margin-bottom: 24px;">
                        <div class="card-content">
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Update Strategy</h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <label style="display: flex; align-items: center; font-size: 14px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
                                    <input type="radio" name="update-strategy" value="merge_best" checked style="margin-right: 12px;">
                                    <div>
                                        <div style="font-weight: 500;">Merge Best Data (Recommended)</div>
                                        <div style="color: #6b7280; font-size: 13px;">Keep the best metrics from both old and new data</div>
                                    </div>
                                </label>
                                <label style="display: flex; align-items: center; font-size: 14px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
                                    <input type="radio" name="update-strategy" value="replace_all" style="margin-right: 12px;">
                                    <div>
                                        <div style="font-weight: 500;">Replace All Data</div>
                                        <div style="color: #6b7280; font-size: 13px;">Replace existing data completely with new data</div>
                                    </div>
                                </label>
                                <label style="display: flex; align-items: center; font-size: 14px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
                                    <input type="radio" name="update-strategy" value="keep_existing" style="margin-right: 12px;">
                                    <div>
                                        <div style="font-weight: 500;">Keep Existing Data</div>
                                        <div style="color: #6b7280; font-size: 13px;">Only add new keywords, don't update existing ones</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Update Preview -->
                    <div class="card" style="display: none;" id="update-preview">
                        <div class="card-content">
                            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Update Preview</h3>
                            <div class="grid grid-4" style="margin-bottom: 16px; text-align: center;">
                                <div style="padding: 16px; background: #d1fae5; border-radius: 8px;">
                                    <div style="font-size: 20px; font-weight: 700; color: #10b981;">150</div>
                                    <div style="font-size: 14px; color: #059669;">New Keywords</div>
                                </div>
                                <div style="padding: 16px; background: #dbeafe; border-radius: 8px;">
                                    <div style="font-size: 20px; font-weight: 700; color: #2563eb;">300</div>
                                    <div style="font-size: 14px; color: #1d4ed8;">Updated Keywords</div>
                                </div>
                                <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
                                    <div style="font-size: 20px; font-weight: 700; color: #374151;">1,000</div>
                                    <div style="font-size: 14px; color: #6b7280;">Unchanged</div>
                                </div>
                                <div style="padding: 16px; background: #fecaca; border-radius: 8px;">
                                    <div style="font-size: 20px; font-weight: 700; color: #dc2626;">25</div>
                                    <div style="font-size: 14px; color: #b91c1c;">Conflicts</div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 12px;">
                                <button class="btn btn-primary">Apply Update</button>
                                <button class="btn btn-secondary" onclick="openConflictResolution()" id="resolve-conflicts-btn">Resolve Conflicts</button>
                                <button class="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Schema Detection Preview -->
                <div class="card" style="display: none;" id="schema-preview">
                    <div class="card-content">
                        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Schema Detected</h3>
                        <div class="grid grid-2" style="margin-bottom: 16px;">
                            <div>
                                <div style="font-size: 14px; color: #6b7280;">Detected Tool</div>
                                <div style="font-weight: 500;">Ahrefs Organic Keywords</div>
                            </div>
                            <div>
                                <div style="font-size: 14px; color: #6b7280;">Confidence</div>
                                <div style="font-weight: 500; color: #10b981;">95%</div>
                            </div>
                        </div>
                        <div style="overflow-x: auto;">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>CSV Column</th>
                                        <th>Maps To</th>
                                        <th>Data Type</th>
                                        <th>Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Keyword</td>
                                        <td>keyword</td>
                                        <td>string</td>
                                        <td><span style="color: #10b981;">✓</span></td>
                                    </tr>
                                    <tr>
                                        <td>Volume</td>
                                        <td>volume</td>
                                        <td>integer</td>
                                        <td><span style="color: #10b981;">✓</span></td>
                                    </tr>
                                    <tr>
                                        <td>KD</td>
                                        <td>keyword_difficulty</td>
                                        <td>integer</td>
                                        <td><span style="color: #10b981;">✓</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Processing Status -->
                <div class="card" style="display: none;" id="processing-status">
                    <div class="card-content">
                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div class="loading-spinner"></div>
                            <h3 style="font-size: 18px; font-weight: 600;">Processing Keywords...</h3>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
                                <span>Progress</span>
                                <span>750 / 1,500 (50%)</span>
                            </div>
                            <div style="width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 8px;">
                                <div style="background-color: #3b82f6; height: 8px; border-radius: 9999px; width: 50%;"></div>
                            </div>
                        </div>
                        <div style="font-size: 14px; color: #6b7280;">
                            Current step: Applying SOP formulas and scoring
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Screen -->
            <div id="dashboard-screen" class="screen">
                <div class="page-header">
                    <h2 class="page-title">Keywords Dashboard</h2>
                    <p class="page-subtitle">Comprehensive analysis of your keyword opportunities</p>
                </div>

                <!-- Summary Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background-color: #dbeafe;">
                            <svg width="16" height="16" style="color: #2563eb;" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">Total Keywords</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon" style="background-color: #d1fae5;">
                            <svg width="16" height="16" style="color: #10b981;" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="stat-value">185</div>
                        <div class="stat-label">Quick Wins</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon" style="background-color: #e9d5ff;">
                            <svg width="16" height="16" style="color: #7c3aed;" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                            </svg>
                        </div>
                        <div class="stat-value">850K</div>
                        <div class="stat-label">Total Volume</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon" style="background-color: #fed7aa;">
                            <svg width="16" height="16" style="color: #ea580c;" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="stat-value">28.5</div>
                        <div class="stat-label">Avg Position</div>
                    </div>
                </div>

                <div class="dashboard-layout">
                    <!-- Filters Sidebar -->
                    <div class="filters-sidebar">
                        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Filters</h3>
                        
                        <!-- Search -->
                        <div class="form-group">
                            <label class="form-label">Search Keywords</label>
                            <input type="text" class="form-input" placeholder="Search keywords, URLs...">
                        </div>

                        <!-- Opportunity Type -->
                        <div class="form-group">
                            <label class="form-label">Opportunity Type</label>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="display: flex; align-items: center; font-size: 14px;">
                                    <input type="checkbox" style="margin-right: 8px;">
                                    Low-Hanging Fruit (185)
                                </label>
                                <label style="display: flex; align-items: center; font-size: 14px;">
                                    <input type="checkbox" style="margin-right: 8px;">
                                    Existing (423)
                                </label>
                                <label style="display: flex; align-items: center; font-size: 14px;">
                                    <input type="checkbox" style="margin-right: 8px;">
                                    Clustering (298)
                                </label>
                                <label style="display: flex; align-items: center; font-size: 14px;">
                                    <input type="checkbox" style="margin-right: 8px;">
                                    Untapped (341)
                                </label>
                            </div>
                        </div>

                        <!-- Volume Range -->
                        <div class="form-group">
                            <label class="form-label">Search Volume</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="number" class="form-input" placeholder="Min">
                                <input type="number" class="form-input" placeholder="Max">
                            </div>
                        </div>

                        <!-- Position Range -->
                        <div class="form-group">
                            <label class="form-label">Position</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="number" class="form-input" placeholder="Min">
                                <input type="number" class="form-input" placeholder="Max">
                            </div>
                        </div>

                        <!-- Action Required -->
                        <div class="form-group">
                            <label class="form-label">Action Required</label>
                            <select class="form-select">
                                <option value="">All Actions</option>
                                <option value="create">Create (298)</option>
                                <option value="optimize">Optimize (185)</option>
                                <option value="upgrade">Upgrade (423)</option>
                                <option value="update">Update (89)</option>
                            </select>
                        </div>

                        <button class="btn btn-primary" style="width: 100%; margin-bottom: 8px;">Apply Filters</button>
                        <button class="btn btn-secondary" style="width: 100%;">Clear All</button>
                    </div>

                    <!-- Main Content -->
                    <div class="main-content">
                        <!-- Controls -->
                        <div class="table-controls">
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 14px; color: #6b7280;">
                                    Showing 1-25 of 1,247 keywords
                                </div>
                                <select style="border: 1px solid #d1d5db; border-radius: 6px; padding: 4px 8px; font-size: 14px;">
                                    <option>25 per page</option>
                                    <option>50 per page</option>
                                    <option>100 per page</option>
                                </select>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 14px; color: #6b7280;">Sort by:</span>
                                <select style="border: 1px solid #d1d5db; border-radius: 6px; padding: 4px 8px; font-size: 14px;">
                                    <option>Total Points (Highest)</option>
                                    <option>Volume (Highest)</option>
                                    <option>Position (Best)</option>
                                    <option>KD (Lowest)</option>
                                    <option>Relevance Score (Highest)</option>
                                    <option>CPC (Highest)</option>
                                    <option>Traffic (Highest)</option>
                                </select>
                                <button class="btn btn-secondary" onclick="toggleColumnSelector()">Columns</button>
                                <button class="btn btn-secondary" onclick="openExportModal()">Export</button>
                            </div>
                        </div>

                        <!-- Column Selector (Hidden by default) -->
                        <div class="card" style="display: none; margin-bottom: 16px;" id="column-selector">
                            <div style="padding: 16px;">
                                <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Customize Columns</h4>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" checked style="margin-right: 8px;"> Keyword
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" checked style="margin-right: 8px;"> Volume
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" checked style="margin-right: 8px;"> KD
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" checked style="margin-right: 8px;"> Position
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" style="margin-right: 8px;"> CPC
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" style="margin-right: 8px;"> Traffic
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" style="margin-right: 8px;"> Intent
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" style="margin-right: 8px;"> Relevance Score
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" style="margin-right: 8px;"> Cluster
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" checked style="margin-right: 8px;"> Points
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" checked style="margin-right: 8px;"> Opportunity
                                    </label>
                                    <label style="display: flex; align-items: center; font-size: 14px;">
                                        <input type="checkbox" checked style="margin-right: 8px;"> Action
                                    </label>
                                </div>
                                <div style="display: flex; gap: 8px; margin-top: 12px;">
                                    <button class="btn btn-primary" style="font-size: 14px;">Apply Changes</button>
                                    <button class="btn btn-secondary" style="font-size: 14px;" onclick="toggleColumnSelector()">Cancel</button>
                                </div>
                            </div>
                        </div>

                        <!-- Keywords Table -->
                        <div class="card">
                            <div style="overflow-x: auto;">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Keyword</th>
                                            <th>Volume</th>
                                            <th>KD</th>
                                            <th>CPC</th>
                                            <th>Position</th>
                                            <th>Traffic</th>
                                            <th>Intent</th>
                                            <th>Relevance</th>
                                            <th>Cluster</th>
                                            <th>Points</th>
                                            <th>Opportunity</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div style="font-weight: 500; color: #111827;">water damage restoration</div>
                                                <div style="font-size: 12px; color: #6b7280;">example.com/water-damage</div>
                                            </td>
                                            <td style="font-weight: 500;">1,900</td>
                                            <td>21</td>
                                            <td style="color: #10b981; font-weight: 500;">$15.50</td>
                                            <td><span class="badge badge-orange">#3</span></td>
                                            <td style="font-weight: 500;">450</td>
                                            <td><span class="badge badge-blue">Commercial</span></td>
                                            <td><span class="badge badge-green">5</span></td>
                                            <td>
                                                <div style="font-size: 12px; color: #1d4ed8; font-weight: 500;">Water Damage Services</div>
                                                <div style="font-size: 10px; color: #6b7280;">(25 keywords)</div>
                                            </td>
                                            <td><span class="badge badge-green" style="font-weight: 600;">33</span></td>
                                            <td><span class="badge badge-green">Low-Hanging</span></td>
                                            <td><span class="badge badge-blue">Optimize</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style="font-weight: 500; color: #111827;">emergency water removal</div>
                                                <div style="font-size: 12px; color: #6b7280;">example.com/emergency-services</div>
                                            </td>
                                            <td style="font-weight: 500;">2,900</td>
                                            <td>18</td>
                                            <td style="color: #10b981; font-weight: 500;">$12.00</td>
                                            <td><span class="badge badge-green">#2</span></td>
                                            <td style="font-weight: 500;">580</td>
                                            <td><span class="badge badge-blue">Commercial</span></td>
                                            <td><span class="badge badge-green">5</span></td>
                                            <td>
                                                <div style="font-size: 12px; color: #1d4ed8; font-weight: 500;">Emergency Services</div>
                                                <div style="font-size: 10px; color: #6b7280;">(32 keywords)</div>
                                            </td>
                                            <td><span class="badge badge-green" style="font-weight: 600;">35</span></td>
                                            <td><span class="badge badge-green">Low-Hanging</span></td>
                                            <td><span class="badge badge-blue">Optimize</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style="font-weight: 500; color: #111827;">water damage insurance claims</div>
                                                <div style="font-size: 12px; color: #6b7280;">Not ranking</div>
                                            </td>
                                            <td style="font-weight: 500;">590</td>
                                            <td>32</td>
                                            <td style="color: #10b981; font-weight: 500;">$8.75</td>
                                            <td><span class="badge" style="background: #f3f4f6; color: #374151;">-</span></td>
                                            <td style="color: #6b7280;">0</td>
                                            <td><span class="badge" style="background: #f3f4f6; color: #6b7280;">Informational</span></td>
                                            <td><span class="badge badge-orange">4</span></td>
                                            <td>
                                                <div style="font-size: 12px; color: #1d4ed8; font-weight: 500;">Insurance & Claims</div>
                                                <div style="font-size: 10px; color: #6b7280;">(28 keywords)</div>
                                            </td>
                                            <td><span class="badge badge-orange" style="font-weight: 600;">22</span></td>
                                            <td><span class="badge badge-purple">Untapped</span></td>
                                            <td><span class="badge badge-orange">Create</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style="font-weight: 500; color: #111827;">flood cleanup dallas</div>
                                                <div style="font-size: 12px; color: #6b7280;">example.com/flood-cleanup</div>
                                            </td>
                                            <td style="font-weight: 500;">720</td>
                                            <td>25</td>
                                            <td style="color: #10b981; font-weight: 500;">$18.20</td>
                                            <td><span class="badge badge-orange">#8</span></td>
                                            <td style="font-weight: 500;">95</td>
                                            <td><span class="badge badge-blue">Commercial</span></td>
                                            <td><span class="badge badge-green">5</span></td>
                                            <td>
                                                <div style="font-size: 12px; color: #1d4ed8; font-weight: 500;">Water Damage Services</div>
                                                <div style="font-size: 10px; color: #6b7280;">(25 keywords)</div>
                                            </td>
                                            <td><span class="badge badge-green" style="font-weight: 600;">29</span></td>
                                            <td><span class="badge badge-green">Low-Hanging</span></td>
                                            <td><span class="badge badge-blue">Optimize</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style="font-weight: 500; color: #111827;">water damage repair cost</div>
                                                <div style="font-size: 12px; color: #6b7280;">example.com/pricing</div>
                                            </td>
                                            <td style="font-weight: 500;">480</td>
                                            <td>28</td>
                                            <td style="color: #10b981; font-weight: 500;">$22.50</td>
                                            <td><span class="badge badge-orange">#25</span></td>
                                            <td style="font-weight: 500;">32</td>
                                            <td><span class="badge badge-blue">Commercial</span></td>
                                            <td><span class="badge badge-green">4</span></td>
                                            <td>
                                                <div style="font-size: 12px; color: #1d4ed8; font-weight: 500;">Pricing & Costs</div>
                                                <div style="font-size: 10px; color: #6b7280;">(15 keywords)</div>
                                            </td>
                                            <td><span class="badge badge-orange" style="font-weight: 600;">24</span></td>
                                            <td><span class="badge badge-blue">Existing</span></td>
                                            <td><span class="badge badge-orange">Upgrade</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Pagination -->
                            <div class="pagination">
                                <div style="font-size: 14px; color: #374151;">
                                    Showing <span style="font-weight: 500;">1</span> to <span style="font-weight: 500;">25</span> of <span style="font-weight: 500;">1,247</span> results
                                </div>
                                <div style="display: flex; gap: 4px;">
                                    <button class="btn btn-secondary">Previous</button>
                                    <button class="btn btn-secondary">1</button>
                                    <button class="btn btn-primary">2</button>
                                    <button class="btn btn-secondary">3</button>
                                    <span style="padding: 8px;">...</span>
                                    <button class="btn btn-secondary">50</button>
                                    <button class="btn btn-secondary">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Clusters Screen -->
            <div id="clusters-screen" class="screen">
                <div class="page-header">
                    <h2 class="page-title">Keyword Clusters</h2>
                    <p class="page-subtitle">Semantic groupings of related keywords for content strategy</p>
                </div>

                <!-- Cluster Summary -->
                <div class="grid grid-3" style="margin-bottom: 32px;">
                    <div class="card">
                        <div class="card-content">
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Total Clusters</h3>
                            <div style="font-size: 30px; font-weight: 700; color: #3b82f6;">23</div>
                            <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Across all keywords</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-content">
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Avg Cluster Size</h3>
                            <div style="font-size: 30px; font-weight: 700; color: #10b981;">54</div>
                            <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Keywords per cluster</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-content">
                            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Quick Wins</h3>
                            <div style="font-size: 30px; font-weight: 700; color: #ea580c;">185</div>
                            <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Across all clusters</div>
                        </div>
                    </div>
                </div>

                <!-- Clusters Grid -->
                <div class="grid grid-3">
                    <div class="cluster-card" onclick="openClusterModal()">
                        <div class="cluster-header">
                            <h3 class="cluster-title">Water Damage Services</h3>
                            <span class="badge badge-green">High Priority</span>
                        </div>
                        <div class="cluster-metrics">
                            <div class="metric-row">
                                <span class="metric-label">Keywords:</span>
                                <span class="metric-value">45</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Total Volume:</span>
                                <span class="metric-value">68,000</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Avg Position:</span>
                                <span class="metric-value">12.5</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Quick Wins:</span>
                                <span class="metric-value" style="color: #10b981;">8</span>
                            </div>
                        </div>
                        <div class="cluster-keywords">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Top Keywords</div>
                            <div>
                                <span class="keyword-tag">water damage restoration</span>
                                <span class="keyword-tag">water damage repair</span>
                                <span class="keyword-tag">flood cleanup</span>
                            </div>
                        </div>
                        <div class="cluster-recommendation">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Recommendation</div>
                            <div>Create comprehensive service page targeting all 45 keywords</div>
                        </div>
                    </div>

                    <div class="cluster-card" onclick="openClusterModal()">
                        <div class="cluster-header">
                            <h3 class="cluster-title">Emergency Water Services</h3>
                            <span class="badge badge-orange">Medium Priority</span>
                        </div>
                        <div class="cluster-metrics">
                            <div class="metric-row">
                                <span class="metric-label">Keywords:</span>
                                <span class="metric-value">32</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Total Volume:</span>
                                <span class="metric-value">45,200</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Avg Position:</span>
                                <span class="metric-value">8.2</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Quick Wins:</span>
                                <span class="metric-value" style="color: #10b981;">12</span>
                            </div>
                        </div>
                        <div class="cluster-keywords">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Top Keywords</div>
                            <div>
                                <span class="keyword-tag">emergency water removal</span>
                                <span class="keyword-tag">24/7 water damage</span>
                            </div>
                        </div>
                        <div class="cluster-recommendation">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Recommendation</div>
                            <div>Optimize existing emergency services page for 12 quick wins</div>
                        </div>
                    </div>

                    <div class="cluster-card" onclick="openClusterModal()">
                        <div class="cluster-header">
                            <h3 class="cluster-title">Insurance & Claims</h3>
                            <span class="badge badge-blue">Content Gap</span>
                        </div>
                        <div class="cluster-metrics">
                            <div class="metric-row">
                                <span class="metric-label">Keywords:</span>
                                <span class="metric-value">28</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Total Volume:</span>
                                <span class="metric-value">18,500</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Avg Position:</span>
                                <span class="metric-value" style="color: #9ca3af;">Not ranking</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Content Gaps:</span>
                                <span class="metric-value" style="color: #ea580c;">28</span>
                            </div>
                        </div>
                        <div class="cluster-keywords">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Top Keywords</div>
                            <div>
                                <span class="keyword-tag">water damage insurance</span>
                                <span class="keyword-tag">filing insurance claims</span>
                            </div>
                        </div>
                        <div class="cluster-recommendation">
                            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Recommendation</div>
                            <div>Create comprehensive insurance guide to capture all 28 opportunities</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Strategic Advice Screen -->
            <div id="strategic-screen" class="screen">
                <div class="page-header">
                    <h2 class="page-title">Strategic SEO Advice</h2>
                    <p class="page-subtitle">Data-driven recommendations and ROI projections</p>
                </div>

                <!-- Executive Summary -->
                <div class="executive-summary">
                    <h3 class="summary-title">Executive Summary</h3>
                    <div class="summary-grid">
                        <div class="summary-metric">
                            <div class="summary-metric-label">Current Traffic Value</div>
                            <div class="summary-metric-value">$43,750</div>
                            <div class="summary-metric-desc">Monthly organic value</div>
                        </div>
                        <div class="summary-metric">
                            <div class="summary-metric-label">Potential Gain</div>
                            <div class="summary-metric-value" style="color: #10b981;">$29,750</div>
                            <div class="summary-metric-desc">Monthly opportunity</div>
                        </div>
                        <div class="summary-metric">
                            <div class="summary-metric-label">Quick Wins</div>
                            <div class="summary-metric-value" style="color: #ea580c;">45</div>
                            <div class="summary-metric-desc">Immediate opportunities</div>
                        </div>
                        <div class="summary-metric">
                            <div class="summary-metric-label">Content Gaps</div>
                            <div class="summary-metric-value" style="color: #7c3aed;">320</div>
                            <div class="summary-metric-desc">New content opportunities</div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="tabs">
                    <div class="tab-nav">
                        <button onclick="showAdviceTab('opportunities')" class="tab-button active">
                            Immediate Opportunities
                        </button>
                        <button onclick="showAdviceTab('content')" class="tab-button">
                            Content Strategy
                        </button>
                        <button onclick="showAdviceTab('roi')" class="tab-button">
                            ROI Projections
                        </button>
                        <button onclick="showAdviceTab('roadmap')" class="tab-button">
                            Implementation
                        </button>
                    </div>
                </div>

                <!-- Immediate Opportunities Tab -->
                <div id="opportunities-tab" class="tab-content active">
                    <div class="grid grid-2">
                        <!-- Quick Wins -->
                        <div class="card">
                            <div class="card-content">
                                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">Quick Wins (2-4 weeks)</h3>
                                <div style="margin-bottom: 16px;">
                                    <div class="opportunity-card">
                                        <div class="opportunity-header">
                                            <h4 class="opportunity-title">emergency water removal</h4>
                                            <span class="opportunity-improvement">Position #3 → #1</span>
                                        </div>
                                        <div class="opportunity-metrics">
                                            Volume: 2,900 | Current Traffic: 420/month
                                        </div>
                                        <div class="opportunity-details">
                                            <strong>Opportunity:</strong> +580 visits/month (+$2,030 value)
                                        </div>
                                        <div class="opportunity-action">
                                            Action: Optimize title tag and add FAQ section
                                        </div>
                                    </div>

                                    <div class="opportunity-card">
                                        <div class="opportunity-header">
                                            <h4 class="opportunity-title">water damage cleanup</h4>
                                            <span class="opportunity-improvement">Position #4 → #2</span>
                                        </div>
                                        <div class="opportunity-metrics">
                                            Volume: 1,600 | Current Traffic: 200/month
                                        </div>
                                        <div class="opportunity-details">
                                            <strong>Opportunity:</strong> +450 visits/month (+$1,575 value)
                                        </div>
                                        <div class="opportunity-action">
                                            Action: Add location-specific content sections
                                        </div>
                                    </div>
                                </div>
                                <div style="padding-top: 16px; border-top: 1px solid #e5e7eb;">
                                    <div style="font-size: 14px; font-weight: 500; color: #111827;">Total Quick Win Potential</div>
                                    <div style="font-size: 18px; font-weight: 700; color: #10b981;">+1,030 visits/month (+$3,605 value)</div>
                                </div>
                            </div>
                        </div>

                        <!-- Content Gaps -->
                        <div class="card">
                            <div class="card-content">
                                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">High-Value Content Gaps</h3>
                                <div style="margin-bottom: 16px;">
                                    <div class="opportunity-card" style="border-left-color: #7c3aed;">
                                        <h4 class="opportunity-title" style="margin-bottom: 8px;">water damage insurance claims</h4>
                                        <div class="opportunity-metrics">
                                            Volume: 590 | KD: 32 | Not ranking
                                        </div>
                                        <div class="opportunity-details">
                                            <strong>Opportunity:</strong> ~60 visits/month (~$210 value)
                                        </div>
                                        <div class="opportunity-action">
                                            Content: Create comprehensive insurance guide
                                        </div>
                                    </div>

                                    <div class="opportunity-card" style="border-left-color: #7c3aed;">
                                        <h4 class="opportunity-title" style="margin-bottom: 8px;">commercial water damage restoration</h4>
                                        <div class="opportunity-metrics">
                                            Volume: 720 | KD: 35 | Not ranking
                                        </div>
                                        <div class="opportunity-details">
                                            <strong>Opportunity:</strong> ~70 visits/month (~$245 value)
                                        </div>
                                        <div class="opportunity-action">
                                            Content: Create dedicated commercial services page
                                        </div>
                                    </div>
                                </div>
                                <div style="padding-top: 16px; border-top: 1px solid #e5e7eb;">
                                    <div style="font-size: 14px; font-weight: 500; color: #111827;">Top 10 Content Gaps</div>
                                    <div style="font-size: 18px; font-weight: 700; color: #7c3aed;">~850 visits/month (~$2,975 value)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

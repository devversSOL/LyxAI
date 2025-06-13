---
title: System Architecture
category: technical
---

# LyxAI System Architecture

This document provides an overview of the LyxAI platform architecture, including the key components, data flow, and integration points.

## Overview

LyxAI is built as a modern web application using Next.js, with a focus on real-time data processing and AI-powered analysis. The system integrates with multiple blockchain data sources and provides users with actionable insights.

## Component Architecture

```mermaid
graph LR
    subgraph "User Interface"
        A["Chat Interface"]
        B["Whale Tracker"]
        C["Contract Analyzer"]
        D["Saved Wallets"]
    end
    
    subgraph "State Management"
        E["React State"]
        F["Real-time Updates"]
        G["Performance Monitor"]
    end
    
    subgraph "API Services"
        H["Analysis Service"]
        I["Whale Service"]
        J["Chat Service"]
        K["Wallet Service"]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    E --> H
    E --> I
    E --> J
    E --> K
    F --> E
    G --> E

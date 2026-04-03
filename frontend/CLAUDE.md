# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **루트 `../CLAUDE.md`의 모든 규칙(한국어 응답, 코딩 규칙, export 규칙, Tailwind v4 등)을 반드시 따른다.**

## 규칙
1. css 하드코딩 금지 -> tailwind v4 유틸리티 클래스 사용
2. 1에 없는 값은 @theme 에 변수로 등록해서 사용
3. 중복 UI 요소 병합
4. spa 링크
## 중복 UI 최소화
1. 중복 속성값을 props 로 개선

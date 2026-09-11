#!/usr/bin/env python3
"""
Test Setup Validator - Проверяет готовность системы к тестированию
"""
import os
import sys
import subprocess
import platform

def check_python():
    """Проверка версии Python"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        return False, f"Python {version.major}.{version.minor}.{version.micro} (требуется 3.8+)"
    return True, f"Python {version.major}.{version.minor}.{version.micro} ✅"

def check_node():
    """Проверка Node.js"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            return True, f"Node.js {version} ✅"
        return False, "Node.js не найден"
    except FileNotFoundError:
        return False, "Node.js не установлен"

def check_npm():
    """Проверка npm"""
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            return True, f"npm {version} ✅"
        return False, "npm не найден"
    except FileNotFoundError:
        return False, "npm не установлен"

def check_git():
    """Проверка Git"""
    try:
        result = subprocess.run(['git', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            return True, f"{version} ✅"
        return False, "Git не найден"
    except FileNotFoundError:
        return False, "Git не установлен"

def check_directories():
    """Проверка структуры проекта"""
    required_dirs = [
        'help-desk_backend-main',
        'help-desk_frontend-main'
    ]
    
    results = []
    for directory in required_dirs:
        if os.path.exists(directory):
            results.append(f"📁 {directory} ✅")
        else:
            results.append(f"📁 {directory} ❌ НЕ НАЙДЕН")
    
    return results

def check_test_files():
    """Проверка тестовых файлов"""
    test_files = [
        'help-desk_backend-main/tests/test_models.py',
        'help-desk_backend-main/tests/test_api.py', 
        'help-desk_backend-main/tests/test_telegram.py',
        'help-desk_backend-main/tests/test_integration.py',
        'help-desk_frontend-main/src/tests/components/Components.test.tsx',
        'help-desk_frontend-main/src/tests/pages/Pages.test.tsx'
    ]
    
    results = []
    for test_file in test_files:
        if os.path.exists(test_file):
            results.append(f"🧪 {os.path.basename(test_file)} ✅")
        else:
            results.append(f"🧪 {os.path.basename(test_file)} ❌")
    
    return results

def check_scripts():
    """Проверка тестовых скриптов"""
    scripts = [
        'run-tests.sh',
        'quick-test.sh', 
        'test-backend.sh',
        'test-frontend.sh'
    ]
    
    results = []
    for script in scripts:
        if os.path.exists(script) and os.access(script, os.X_OK):
            results.append(f"📜 {script} ✅")
        elif os.path.exists(script):
            results.append(f"📜 {script} ⚠️ (не исполняемый)")
        else:
            results.append(f"📜 {script} ❌")
    
    return results

def check_backend_deps():
    """Проверка зависимостей бэкенда"""
    if not os.path.exists('help-desk_backend-main/requirements.txt'):
        return "❌ requirements.txt не найден"
    
    return "✅ requirements.txt найден"

def check_frontend_deps():
    """Проверка зависимостей фронтенда"""
    if not os.path.exists('help-desk_frontend-main/package.json'):
        return "❌ package.json не найден"
    
    if os.path.exists('help-desk_frontend-main/node_modules'):
        return "✅ package.json найден, node_modules установлены"
    else:
        return "⚠️ package.json найден, но node_modules не установлены"

def main():
    print("🧪 HelpDesk System - Test Environment Validator")
    print("=" * 60)
    
    # Системная информация
    print(f"\n💻 Система: {platform.system()} {platform.release()}")
    print(f"🏗️ Архитектура: {platform.machine()}")
    
    # Проверка языков программирования
    print("\n🔧 Языки программирования:")
    python_ok, python_msg = check_python()
    print(f"  {python_msg}")
    
    node_ok, node_msg = check_node()
    print(f"  {node_msg}")
    
    npm_ok, npm_msg = check_npm()
    print(f"  {npm_msg}")
    
    git_ok, git_msg = check_git()
    print(f"  {git_msg}")
    
    # Проверка структуры проекта
    print("\n📂 Структура проекта:")
    dir_results = check_directories()
    for result in dir_results:
        print(f"  {result}")
    
    # Проверка тестовых файлов
    print("\n🧪 Тестовые файлы:")
    test_results = check_test_files()
    for result in test_results:
        print(f"  {result}")
    
    # Проверка скриптов
    print("\n📜 Тестовые скрипты:")
    script_results = check_scripts()
    for result in script_results:
        print(f"  {result}")
    
    # Проверка зависимостей
    print("\n📦 Зависимости:")
    backend_deps = check_backend_deps()
    print(f"  Backend: {backend_deps}")
    
    frontend_deps = check_frontend_deps()
    print(f"  Frontend: {frontend_deps}")
    
    # Общая оценка
    print("\n" + "=" * 60)
    
    all_requirements_met = all([
        python_ok, node_ok, npm_ok,
        os.path.exists('help-desk_backend-main'),
        os.path.exists('help-desk_frontend-main'),
        os.path.exists('run-tests.sh')
    ])
    
    if all_requirements_met:
        print("🎉 Система готова к тестированию!")
        print("\n📋 Доступные команды:")
        print("  ./run-tests.sh          - Полный набор тестов")
        print("  ./quick-test.sh         - Быстрые тесты")
        print("  ./test-backend.sh       - Только бэкенд")
        print("  ./test-frontend.sh      - Только фронтенд")
        print("\n📚 Документация: TESTING.md")
        
    else:
        print("⚠️ Необходимо устранить проблемы перед запуском тестов")
        print("\n🔧 Возможные решения:")
        if not python_ok:
            print("  - Установите Python 3.8+ с python.org")
        if not node_ok:
            print("  - Установите Node.js с nodejs.org")
        if not npm_ok:
            print("  - npm обычно устанавливается с Node.js")
        if not os.path.exists('help-desk_backend-main'):
            print("  - Убедитесь, что вы в корневой директории проекта")
        
        print("\n📞 Помощь:")
        print("  - Проверьте TESTING.md для подробных инструкций")
        print("  - Убедитесь, что все файлы загружены корректно")

if __name__ == '__main__':
    main()
/**
 Copyright (C) 2012 David Quintana <gigaherz@gmail.com>

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*global walker:true */

(function (exports) {
    'use strict';

    var Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
    };

    var Walker = (function WalkerClosure() {

        function Walker() {
            this.walkBreakStatement = null;
            this.walkContinueStatement = null;
            this.walkDebuggerStatement = null;
            this.walkEmptyStatement = null;
            this.walkIdentifier = null;
            this.walkLiteral = null;
            this.walkThisExpression = null;

            this.enterAssignmentExpression = null;
            this.enterArrayExpression = null;
            this.enterBinaryExpression = null;
            this.enterBlockStatement = null;
            this.enterCallExpression = null;
            this.enterCatchClause = null;
            this.enterConditionalExpression = null;
            this.enterDoWhileStatement = null;
            this.enterExpressionStatement = null;
            this.enterForStatement = null;
            this.enterForInStatement = null;
            this.enterFunctionDeclaration = null;
            this.enterFunctionExpression = null;
            this.enterIfStatement = null;
            this.enterLabeledStatement = null;
            this.enterLogicalExpression = null;
            this.enterMemberExpression = null;
            this.enterNewExpression = null;
            this.enterObjectExpression = null;
            this.enterProgram = null;
            this.enterProperty = null;
            this.enterReturnStatement = null;
            this.enterSequenceExpression = null;
            this.enterSwitchStatement = null;
            this.enterSwitchCase = null;
            this.enterThrowStatement = null;
            this.enterTryStatement = null;
            this.enterUnaryExpression = null;
            this.enterUpdateExpression = null;
            this.enterVariableDeclaration = null;
            this.enterVariableDeclarator = null;
            this.enterWithStatement = null;
            this.enterWhileStatement = null;

            // Arrays
            this.enterCatchClauses = null;
            this.enterExpressions = null;
            this.enterParams = null;
            this.enterProperties = null;
            this.enterStatements = null;
            this.enterSwitchCases = null;
            this.enterVariables = null;

            this.exitAssignmentExpression = null;
            this.exitArrayExpression = null;
            this.exitBlockStatement = null;
            this.exitBinaryExpression = null;
            this.exitCallExpression = null;
            this.exitCatchClause = null;
            this.exitConditionalExpression = null;
            this.exitDoWhileStatement = null;
            this.exitExpressionStatement = null;
            this.exitForStatement = null;
            this.exitForInStatement = null;
            this.exitFunctionDeclaration = null;
            this.exitFunctionExpression = null;
            this.exitIfStatement = null;
            this.exitLabeledStatement = null;
            this.exitLogicalExpression = null;
            this.exitMemberExpression = null;
            this.exitNewExpression = null;
            this.exitObjectExpression = null;
            this.exitProgram = null;
            this.exitProperty = null;
            this.exitReturnStatement = null;
            this.exitSequenceExpression = null;
            this.exitSwitchStatement = null;
            this.exitSwitchCase = null;
            this.exitThrowStatement = null;
            this.exitTryStatement = null;
            this.exitUnaryExpression = null;
            this.exitUpdateExpression = null;
            this.exitVariableDeclaration = null;
            this.exitVariableDeclarator = null;
            this.exitWithStatement = null;
            this.exitWhileStatement = null;

            // Arrays
            this.exitCatchClauses = null;
            this.exitExpressions = null;
            this.exitParams = null;
            this.exitProperties = null;
            this.exitStatements = null;
            this.exitSwitchCases = null;
            this.exitVariables = null;
        }

        Walker.prototype = {

            walkStatementArray: function Walker_walkStatementArray(
                    nodes, parent, fieldName) {
                var i;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                if (this.enterStatements) {
                    this.enterStatements(nodes, parent, fieldName);
                }

                for (i = 0; i < nodes.length; i++) {
                    nodes[i] =
                            this.walkElement(nodes[i], parent, fieldName, nodes,
                                    i);
                }

                return (this.exitStatements) ?
                        this.exitStatements(nodes, parent, fieldName) : nodes;
            },

            walkExpressionArray: function Walker_walkExpressionArray(
                    nodes, parent, fieldName) {
                var i;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                if (this.enterExpressions) {
                    this.enterExpressions(nodes, parent,
                            fieldName);
                }

                for (i = 0; i < nodes.length; i++) {
                    if(typeof nodes[i] !== 'undefined') {
                        nodes[i] =
                                this.walkElement(nodes[i], parent, fieldName,
                                        nodes, i);
                    }
                }

                return (this.exitExpressions) ?
                        this.exitExpressions(nodes, parent, fieldName) : nodes;
            },

            walkParamArray: function Walker_walkParamArray(
                    nodes, parent, fieldName) {
                var i;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                if (this.enterParams) {
                    this.enterParams(nodes, parent, fieldName);
                }

                for (i = 0; i < nodes.length; i++) {
                    nodes[i] =
                            this.walkElement(nodes[i], parent, fieldName, nodes,
                                    i);
                }

                return (this.exitParams) ?
                        this.exitParams(nodes, parent, fieldName) :
                        nodes;
            },

            walkPropertyArray: function Walker_walkPropertyArray(
                    nodes, parent, fieldName) {
                var i;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                if (this.enterProperties) {
                    this.enterProperties(nodes, parent,
                            fieldName);
                }

                for (i = 0; i < nodes.length; i++) {
                    nodes[i] =
                            this.walkElement(nodes[i], parent, fieldName, nodes,
                                    i);
                }

                return (this.exitProperties) ?
                        this.exitProperties(nodes, parent, fieldName) : nodes;
            },

            walkVariableArray: function Walker_walkVariableArray(
                    nodes, parent, fieldName) {
                var i;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                if (this.enterVariables) {
                    this.enterVariables(nodes, parent,
                            fieldName);
                }

                for (i = 0; i < nodes.length; i++) {
                    nodes[i] =
                            this.walkElement(nodes[i], parent, fieldName, nodes,
                                    i);
                }

                return (this.exitVariables) ?
                        this.exitVariables(nodes, parent, fieldName) : nodes;
            },

            walkCatchArray: function Walker_walkCatchArray(
                    nodes, parent, fieldName) {
                var i;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                if (this.enterCatchClauses) {
                    this.enterCatchClauses(nodes,
                            parent,
                            fieldName);
                }

                for (i = 0; i < nodes.length; i++) {
                    nodes[i] =
                            this.walkElement(nodes[i], parent, fieldName, nodes,
                                    i);
                }

                return (this.exitCatchClauses) ?
                        this.exitCatchClauses(nodes, parent, fieldName) : nodes;
            },

            walkCaseArray: function Walker_walkCaseArray(
                    nodes, parent, fieldName) {
                var i;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                if (this.enterSwitchCases) {
                    this.enterSwitchCases(nodes, parent,
                            fieldName);
                }

                for (i = 0; i < nodes.length; i++) {
                    nodes[i] =
                            this.walkElement(nodes[i], parent, fieldName, nodes,
                                    i);
                }

                return (this.exitSwitchCases) ?
                        this.exitSwitchCases(nodes, parent, fieldName) : nodes;
            },

            walkElement: function Walker_walkElement(
                    node, parent, fieldName, siblings, index) {

                var implemented = false;

                if (arguments.length < 3) {
                    throw "Invalid number of arguments.";
                }

                switch (node.type) {
                case Syntax.AssignmentExpression:
                    if (this.enterAssignmentExpression) {
                        this.enterAssignmentExpression.apply(this,
                                arguments);
                    }
                    node.left = this.walkElement(node.left, node, 'left');
                    node.right =
                            this.walkElement(node.right, node, 'right');
                    node = (this.exitAssignmentExpression) ?
                            this.exitAssignmentExpression.apply(this,
                                    arguments) : node;
                    implemented = true;
                    break;
                case Syntax.ArrayExpression:
                    if (this.enterArrayExpression) {
                        this.enterArrayExpression.apply(this,
                                arguments);
                    }
                    node.elements =
                            this.walkExpressionArray(node.elements, node,
                                    'elements');
                    node = (this.exitArrayExpression) ?
                            this.exitArrayExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.BlockStatement:
                    if (this.enterBlockStatement) {
                        this.enterBlockStatement.apply(this,
                                arguments);
                    }
                    node.body =
                            this.walkStatementArray(node.body, node,
                                    'body');
                    node = (this.exitBlockStatement) ?
                            this.exitBlockStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.BinaryExpression:
                    if (this.enterBinaryExpression) {
                        this.enterBinaryExpression.apply(this,
                                arguments);
                    }
                    node.left = this.walkElement(node.left, node, 'left');
                    node.right =
                            this.walkElement(node.right, node, 'right');
                    node = (this.exitBinaryExpression) ?
                            this.exitBinaryExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.BreakStatement:
                    node = (this.walkBreakStatement) ?
                            this.walkBreakStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.CallExpression:
                    if (this.enterCallExpression) {
                        this.enterCallExpression.apply(this,
                                arguments);
                    }
                    node.callee =
                            this.walkElement(node.callee, node, 'callee');
                    node['arguments'] =
                            this.walkExpressionArray(node['arguments'], node,
                                    'arguments');
                    node = (this.exitCallExpression) ?
                            this.exitCallExpression.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.CatchClause:
                    if (this.enterCatchClause) {
                        this.enterCatchClause.apply(this,
                                arguments);
                    }
                    node.param =
                            this.walkElement(node.param, node, 'param');
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitCatchClause) ?
                            this.exitCatchClause.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.ConditionalExpression:
                    if (this.enterConditionalExpression) {
                        this.enterConditionalExpression.apply(this,
                                arguments);
                    }
                    node.test = this.walkElement(node.test, node, 'test');
                    node.consequent = this.walkElement(node.consequent, node, 'consequent');
                    node.alternate = this.walkElement(node.alternate, node, 'alternate');
                    node = (this.exitConditionalExpression) ?
                            this.exitConditionalExpression.apply(this,
                                    arguments) : node;
                    implemented = true;
                    break;
                case Syntax.ContinueStatement:
                    node = (this.walkContinueStatement) ?
                            this.walkContinueStatement.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.DoWhileStatement:
                    if (this.enterDoWhileStatement) {
                        this.enterDoWhileStatement.apply(this, arguments);
                    }
                    node.body = this.walkElement(node.body, node, 'body');
                    node.test = this.walkElement(node.test, node, 'test');
                    node = (this.exitDoWhileStatement) ?
                            this.exitDoWhileStatement.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.DebuggerStatement:
                    node = (this.walkDebuggerStatement) ?
                            this.walkDebuggerStatement.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.EmptyStatement:
                    node = (this.walkEmptyStatement) ?
                            this.walkEmptyStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.ExpressionStatement:
                    if (this.enterExpressionStatement) {
                        this.enterExpressionStatement.apply(this,
                                arguments);
                    }
                    node.expression =
                            this.walkElement(node.expression, node,
                                    'expression');
                    node = (this.exitExpressionStatement) ?
                            this.exitExpressionStatement.apply(this,
                                    arguments) : node;
                    implemented = true;
                    break;
                case Syntax.ForStatement:
                    if (this.enterForStatement) {
                        this.enterForStatement.apply(this, arguments);
                    }
                    if (node.init) {
                        node.init =
                                this.walkElement(node.init, node, 'init');
                    }
                    if (node.test) {
                        node.test =
                                this.walkElement(node.test, node, 'test');
                    }
                    if (node.update) {
                        node.update =
                                this.walkElement(node.update, node, 'update');
                    }
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitForStatement) ?
                            this.exitForStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.ForInStatement:
                    if (this.enterForInStatement) {
                        this.enterForInStatement.apply(this, arguments);
                    }
                    node.left = this.walkElement(node.left, node, 'left');
                    node.right =
                            this.walkElement(node.right, node, 'right');
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitForInStatement) ?
                            this.exitForInStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.FunctionDeclaration:
                    if (this.enterFunctionDeclaration) {
                        this.enterFunctionDeclaration.apply(this,
                                arguments);
                    }
                    node.params =
                            this.walkParamArray(node.params, node,
                                    'params');
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitFunctionDeclaration) ?
                            this.exitFunctionDeclaration.apply(this,
                                    arguments) : node;
                    implemented = true;
                    break;
                case Syntax.FunctionExpression:
                    if (this.enterFunctionExpression) {
                        this.enterFunctionExpression.apply(this, arguments);
                    }
                    node.params =
                            this.walkParamArray(node.params, node,
                                    'params');
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitFunctionExpression) ?
                            this.exitFunctionExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.Identifier:
                    node =
                            (this.walkIdentifier) ?
                                    this.walkIdentifier.apply(this,
                                            arguments) :
                                    node;
                    implemented = true;
                    break;
                case Syntax.IfStatement:
                    if (this.enterIfStatement) {
                        this.enterIfStatement.apply(this, arguments);
                    }
                    node.test = this.walkElement(node.test, node, 'test');
                    node.consequent =
                            this.walkElement(node.consequent, node,
                                    'consequent');
                    if (node.alternate) {
                        node.alternate =
                                this.walkElement(node.alternate, node,
                                        'alternate');
                    }
                    node = (this.exitIfStatement) ?
                            this.exitIfStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.Literal:
                    node =
                            (this.walkLiteral) ?
                                    this.walkLiteral.apply(this,
                                            arguments) : node;
                    implemented = true;
                    break;
                case Syntax.LabeledStatement:
                    if (this.enterLabeledStatement) {
                        this.enterLabeledStatement.apply(this, arguments);
                    }
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitLabeledStatement) ?
                            this.exitLabeledStatement.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.LogicalExpression:
                    if (this.enterLogicalExpression) {
                        this.enterLogicalExpression.apply(this, arguments);
                    }
                    node.left = this.walkElement(node.left, node, 'left');
                    node.right =
                            this.walkElement(node.right, node, 'right');
                    node = (this.exitLogicalExpression) ?
                            this.exitLogicalExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.MemberExpression:
                    if (this.enterMemberExpression) {
                        this.enterMemberExpression.apply(this, arguments);
                    }
                    node.object =
                            this.walkElement(node.object, node, 'object');
                    node.property =
                            this.walkElement(node.property, node,
                                    'property');
                    node = (this.exitMemberExpression) ?
                            this.exitMemberExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.NewExpression:
                    if (this.enterNewExpression) {
                        this.enterNewExpression.apply(this,
                                arguments);
                    }
                    node.callee =
                            this.walkElement(node.callee, node, 'callee');
                    node['arguments'] =
                            this.walkExpressionArray(node['arguments'], node,
                                    'arguments');
                    node = (this.exitNewExpression) ?
                            this.exitNewExpression.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.ObjectExpression:
                    if (this.enterObjectExpression) {
                        this.enterObjectExpression.apply(this, arguments);
                    }
                    node.properties =
                            this.walkPropertyArray(node.properties, node,
                                    'properties');
                    node = (this.exitObjectExpression) ?
                            this.exitObjectExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.Program:
                    if (this.enterProgram) {
                        this.enterProgram.apply(this,
                                arguments);
                    }
                    node.body =
                            this.walkStatementArray(node.body, node,
                                    'body');
                    node =
                            (this.exitProgram) ?
                                    this.exitProgram.apply(this,
                                            arguments) : node;
                    implemented = true;
                    break;
                case Syntax.Property:
                    if (this.enterProperty) {
                        this.enterProperty.apply(this,
                                arguments);
                    }
                    node.value =
                            this.walkElement(node.value, node, 'value');
                    node =
                            (this.exitProperty) ?
                                    this.exitProperty.apply(this,
                                            arguments) :
                                    node;
                    implemented = true;
                    break;
                case Syntax.ReturnStatement:
                    if (this.enterReturnStatement) {
                        this.enterReturnStatement.apply(this,
                                arguments);
                    }
                    if(node.argument){
                        node.argument =
                                this.walkElement(node.argument, node,
                                        'argument');                        
                    }

                    node = (this.exitReturnStatement) ?
                            this.exitReturnStatement.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.SequenceExpression:
                    if (this.enterSequenceExpression) {
                        this.enterSequenceExpression.apply(this,
                                arguments);
                    }
                    node.expressions =
                            this.walkExpressionArray(node.expressions, node,
                                    'expressions');
                    node = (this.exitSequenceExpression) ?
                            this.exitSequenceExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.SwitchStatement:
                    if (this.enterSwitchStatement) {
                        this.enterSwitchStatement.apply(this,
                                arguments);
                    }
                    node.discriminant =
                            this.walkElement(node.discriminant, node,
                                    'discriminant');
                    if (node.cases) {
                        node.cases =
                                this.walkCaseArray(node.cases, node,
                                        'cases');
                    }
                    node = (this.exitSwitchStatement) ?
                            this.exitSwitchStatement.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.SwitchCase:
                    if (this.enterSwitchCase) {
                        this.enterSwitchCase.apply(this,
                                arguments);
                    }
                    if (node.test) {
                        node.test =
                                this.walkElement(node.test, node, 'test');
                    }
                    node.consequent =
                            this.walkStatementArray(node.consequent, node,
                                    'consequent');
                    node =
                            (this.exitSwitchCase) ?
                                    this.exitSwitchCase.apply(this,
                                            arguments) :
                                    node;
                    implemented = true;
                    break;
                case Syntax.ThisExpression:
                    node = (this.walkThisExpression) ?
                            this.walkThisExpression.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.ThrowStatement:
                    if (this.enterThrowStatement) {
                        this.enterThrowStatement.apply(this,
                                arguments);
                    }
                    node.argument =
                            this.walkElement(node.argument, node,
                                    'argument');
                    node = (this.exitThrowStatement) ?
                            this.exitThrowStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.TryStatement:
                    if (this.enterTryStatement) {
                        this.enterTryStatement.apply(this,
                                arguments);
                    }
                    node.block =
                            this.walkElement(node.block, node, 'block');
                    node.handlers =
                            this.walkCatchArray(node.handlers, node,
                                    'handlers');
                    if (node.finalizer) {
                        node.finalizer =
                                this.walkElement(node.finalizer, node,
                                        'finalizer');
                    }
                    node = (this.exitTryStatement) ?
                            this.exitTryStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.UnaryExpression:
                    if (this.enterUnaryExpression) {
                        this.enterUnaryExpression.apply(this,
                                arguments);
                    }
                    node.argument =
                            this.walkElement(node.argument, node,
                                    'argument');
                    node = (this.exitUnaryExpression) ?
                            this.exitUnaryExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.UpdateExpression:
                    if (this.enterUpdateExpression) {
                        this.enterUpdateExpression.apply(this,
                                arguments);
                    }
                    node.argument =
                            this.walkElement(node.argument, node,
                                    'argument');
                    node = (this.exitUpdateExpression) ?
                            this.exitUpdateExpression.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.VariableDeclaration:
                    if (this.enterVariableDeclaration) {
                        this.enterVariableDeclaration.apply(this,
                                arguments);
                    }
                    node.declarations =
                            this.walkVariableArray(node.declarations, node,
                                    'declarations');
                    node = (this.exitVariableDeclaration) ?
                            this.exitVariableDeclaration.apply(this,
                                    arguments) : node;
                    implemented = true;
                    break;
                case Syntax.VariableDeclarator:
                    if (this.enterVariableDeclarator) {
                        this.enterVariableDeclarator.apply(this,
                                arguments);
                    }
                    node.id = this.walkElement(node.id, node, 'id');
                    if (node.init) {
                        node.init =
                                this.walkElement(node.init, node, 'init');
                    }
                    node = (this.exitVariableDeclarator) ?
                            this.exitVariableDeclarator.apply(this,
                                    arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.WithStatement:
                    if (this.enterWithStatement) {
                        this.enterWithStatement.apply(this,
                                arguments);
                    }
                    node.object =
                            this.walkElement(node.object, node, 'object');
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitWithStatement) ?
                            this.exitWithStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                case Syntax.WhileStatement:
                    if (this.enterWhileStatement) {
                        this.enterWhileStatement.apply(this,
                                arguments);
                    }
                    node.test = this.walkElement(node.test, node, 'test');
                    node.body = this.walkElement(node.body, node, 'body');
                    node = (this.exitWhileStatement) ?
                            this.exitWhileStatement.apply(this, arguments) :
                            node;
                    implemented = true;
                    break;
                }

                if (!implemented) {
                    process.stdout.write('Unimplemented: ' + node.type +
                            '\nContents: ' +
                            JSON.stringify(node) + '\n');
                }

                return node;
            },

            walk: function Walker_walk(root) {
                return this.walkElement(root, null, '');
            }

        };

        return Walker;
    })();

    function createWalker() {
        return new Walker();
    }

    // Sync with package.json.
    exports.version = '0.1.1';
    exports.createWalker = createWalker;

    return exports;
}(typeof exports === 'undefined' ? (walker = {}) : exports));
